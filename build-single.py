"""Build a portable HTML from the sibling original source files; no dependencies."""
from pathlib import Path
root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text(encoding='utf-8')
for name in ('game.js', 'ui.js'):
    code = (root / name).read_text(encoding='utf-8')
    if '</script' in code.lower():
        raise ValueError('Source contains an HTML script closing tag')
    tag = '<script src="' + name + '"></script>'
    if html.count(tag) != 1:
        raise ValueError('Expected exactly one source tag for ' + name)
    html = html.replace(tag, '<script>\n' + code + '\n</script>')
license_text = (root / 'LICENSE').read_text(encoding='utf-8')
if '--' in license_text:
    raise ValueError('License cannot be embedded in an HTML comment')
html = html.replace('<!doctype html>', '<!doctype html>\n<!--\n' + license_text + '\n-->')
(root / 'last-light-courier.html').write_text(html, encoding='utf-8')
