"""Check crawlable bilingual SEO in the static build without a network service."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.meta, self.schemas = [], {}, []
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link':
            self.links.append(attrs)
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content')
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.script = ''

    def handle_data(self, data):
        if self.script is not None:
            self.script += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.schemas.append(json.loads(self.script))
            self.script = None


def main():
    sitemap = ET.parse(ROOT / 'dist/sitemap.xml')
    urls = [element.text for element in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert len(urls) == 66 and len(set(urls)) == 66
    assert all(url.startswith('https://') and '404' not in url for url in urls)
    canonical_urls = set()
    for file in (ROOT / 'dist').rglob('*.html'):
        head = Head()
        head.feed(file.read_text().split('</head>')[0])
        canonical = next(link['href'] for link in head.links if link.get('rel') == 'canonical')
        assert urlparse(canonical).scheme == 'https' and not urlparse(canonical).query
        alternatives = {link.get('hreflang'): link['href'] for link in head.links if link.get('rel') == 'alternate'}
        assert set(alternatives) == {'en', 'de-DE', 'x-default'}
        assert all(url.startswith('https://') for url in alternatives.values())
        assert head.meta['description'] and head.meta['og:image'].startswith('https://')
        assert head.meta['og:url'] == canonical
        assert head.schemas and len(head.schemas[0]['@graph']) == 4
        if '404' in str(file):
            assert 'noindex' in head.meta['robots']
        else:
            canonical_urls.add(canonical)
    assert canonical_urls == set(urls)
    assert 'Sitemap: ' + urls[0].split('/de/')[0].split('/projects/')[0].rstrip('/') + '/sitemap.xml' in (ROOT / 'dist/robots.txt').read_text()
    assert not list((ROOT / 'dist/plans').glob('*.pdf'))
    assert not list((ROOT / 'dist/drawings').glob('*.pdf'))
    assert all('-mr-' not in file.name.lower() for file in (ROOT / 'dist/plans').iterdir())
    print('Verified canonical URLs, EN/de-DE alternatives, structured data, sitemap and robots for all 68 HTML pages; no public plan PDFs.')


if __name__ == '__main__':
    main()
