"""Import a founder-owned, already published Reel for the homepage preview.
No database credentials, Instagram messages, or customer information are used.
The source permalink was returned by the connected Instagram account read API.
"""
import hashlib
import json
import pathlib
import subprocess
import tempfile
import urllib.request
from urllib.parse import urlparse

SOURCE = 'https://scontent-fra5-1.cdninstagram.com/o1/v/t2/f2/m86/AQPz-YIf95gYLxxs6bpZaICNf5rev-wianDurs8jED6AeYnalH2cbnWpTvGSrNIFCU7iPMddIHXVJX2GbI0RdBdsPQwOwFgfhwpJrtI.mp4?_nc_cat=102&_nc_sid=5e9851&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_ohc=idvFE7p8xw0Q7kNvwEWT7Sa&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTgxMDA2OTY4MDI1MzkzNjAsImFzc2V0X2FnZV9kYXlzIjoxMiwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjY5LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=efd10a9eed929ae&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC81RUFDMUIzM0YwNTY0M0JGQjk1QUNBQTc4QTRENkNBMV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzM5RDU3REY4MjRDNjQzNDZCMDNCQkU1MDJGMEZCNTk4X2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACbA3dGxnJ-nQBUCKAJDMywXQFF90vGp--cYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=yriHy_BOaTMwPNVHE0dong&edm=AEZPnVgEAAAA&_nc_zt=28&oh=00_AQSLgTAMuFQW1WI8a0m6jXSaf84aCmMzix9krLXIx0u7fw&oe=6AED3E23'
assert urlparse(SOURCE).hostname.endswith('.cdninstagram.com')
assets = pathlib.Path('public/demo')
review = pathlib.Path('artifacts/leadmagnet-source')
assets.mkdir(parents=True, exist_ok=True)
review.mkdir(parents=True, exist_ok=True)
name = 'kevin-leadmagnet-claude-20261023'
video, poster = assets / f'{name}.mp4', assets / f'{name}.jpg'
if video.exists() and poster.exists():
    print('The approved local assets already exist; no remote download.')
    raise SystemExit(0)

def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout

with tempfile.TemporaryDirectory() as temporary:
    original = pathlib.Path(temporary) / 'source.mp4'
    req = urllib.request.Request(SOURCE, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=45) as response, original.open('wb') as output:
        if not urlparse(response.url).hostname.endswith('.cdninstagram.com'):
            raise RuntimeError('Unexpected media redirect')
        size = 0
        while chunk := response.read(1024 * 1024):
            size += len(chunk)
            if size > 60 * 1024 * 1024:
                raise RuntimeError('Unexpectedly large source; inspect manually')
            output.write(chunk)
    probe = json.loads(run('ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(original)))
    stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
    duration = float(probe['format']['duration'])
    assert 30 < duration < 120, 'Unexpected video duration'
    assert stream['height'] > stream['width'], 'Expected the vertical founder Reel'
    for at in (1, 5, 10, 20, 35, 55):
        run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', str(at), '-i', str(original), '-frames:v', '1', '-vf', 'scale=360:-2', '-q:v', '3', str(review / f'source-{at:02}.jpg'))
    # A continuous excerpt, without invented graphics, captions, or another face.
    run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', '3', '-i', str(original), '-t', '20', '-vf', 'scale=540:-2,fps=24', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-maxrate', '1000k', '-bufsize', '2000k', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(video))
    run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', '6', '-i', str(original), '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '3', str(poster))
    provenance = {'source': 'connected Instagram account / published Reel', 'username': 'kevin.dufraisse', 'permalink': 'https://www.instagram.com/reel/De1ncaACJuN/', 'caption': 'Commente « CLAUDE »', 'published_date': '2026-10-23', 'source_sha256': hashlib.sha256(original.read_bytes()).hexdigest(), 'source_duration_seconds': duration, 'excerpt_start_seconds': 3, 'excerpt_duration_seconds': 20, 'audio': 'removed for the silent homepage preview', 'note': 'Not a database export. Automated DM is an illustrative website scene; no private message is read or sent.'}
    (assets / f'{name}.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
    (review / 'provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'duration': duration, 'width': stream['width'], 'height': stream['height'], 'excerpt_bytes': video.stat().st_size}))
