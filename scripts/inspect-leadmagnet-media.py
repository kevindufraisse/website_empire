"""Read-only inspection of the two video files explicitly supplied by Kevin.
No database, no social messaging, no third-party account access.
Temporary review assets only; this helper is removed before release.
"""
import json
import pathlib
import subprocess
import urllib.request

OUT = pathlib.Path('artifacts/leadmagnet-media')
OUT.mkdir(parents=True, exist_ok=True)
URLS = {
    'original': 'https://scontent-cdg4-3.cdninstagram.com/o1/v/t2/f2/m86/AQPBb0psd7d8gDlZvnTImP0lM--rP6PeO-7evFCV2Mmn662DKEysyOcOZ0Oc-PodjhWbUUhg5vKcvjoY9iTHy-6g4HY6w4pSwhH_3GM.mp4?_nc_cat=106&_nc_sid=5e9851&_nc_ht=scontent-cdg4-3.cdninstagram.com&_nc_ohc=GnF3QxahLowQ7kNvwHWOLKM&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MjM2MjEwMzI3NzkzOTI2OSwiYXNzZXRfYWdlX2RheXMiOjIxLCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6NjAsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&vs=b70eb113ae9515b7&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC84OTEzRkIxM0MwNUU0MjE3QkRGNDcyNDAzOEMzMzU3MF92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzM4RERBREU3QTM5RDRCMTZBRjk4NzU2NkJFMUQ0QzI1X2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACaKqe_swJSyCBUCKAJDMywXQE564UeuFHsYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=X5cRPxijcTZYaBK83TOuyg&_nc_zt=28&_nc_ss=7a22e&oh=00_AQSh5aOnejrhKdPPwYZym7ZQk0DqiYUOSZVA1Vg320GeyQ&oe=6AEDA9DB',
    'kevin': 'https://scontent-cdg6-1.cdninstagram.com/o1/v/t2/f2/m86/AQPz-YIf95gYLxxs6bpZaICNf5rev-wianDurs8jED6AeYnalH2cbnWpTvGSrNIFCU7iPMddIHXVJX2GbI0RdBdsPQwOwFgfhwpJrtI.mp4?_nc_cat=102&_nc_sid=5e9851&_nc_ht=scontent-cdg6-1.cdninstagram.com&_nc_ohc=idvFE7p8xw0Q7kNvwHLgbE9&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTgxMDA2OTY4MDI1MzkzNjAsImFzc2V0X2FnZV9kYXlzIjoxMiwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjY5LCJ3YXRjaF90aW1lX3MiOjY0MjksInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&vs=efd10a9eed929ae&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC81RUFDMUIzM0YwNTY0M0JGQjk1QUNBQTc4QTRENkNBMV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzM5RDU3REY4MjRDNjQzNDZCMDNCQkU1MDJGMEZCNTk4X2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACbA3dGxnJ-nQBUCKAJDMywXQFF90vGp--cYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=4CTmzcUrR5YjfM5HcqZsmA&_nc_ss=7a22e&_nc_zt=28&oh=00_AQTzcmEBjYtzVSeqqE1U5mTSCmmlF4dH6goE666qIIWkNg&oe=6AED7663',
}
report = []
for name, url in URLS.items():
    path = OUT / (name + '.mp4')
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=45) as response, path.open('wb') as handle:
            total = 0
            while data := response.read(1024 * 1024):
                total += len(data)
                if total > 150 * 1024 * 1024:
                    raise RuntimeError('Video exceeds inspection limit')
                handle.write(data)
        probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))
        report.append({'name': name, 'bytes': total, 'duration': probe['format']['duration'], 'streams': [{k: v for k, v in stream.items() if k in ('codec_type','codec_name','width','height','r_frame_rate')} for stream in probe['streams']]})
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(path),'-vf','fps=1/8,scale=180:-2,tile=4x2','-frames:v','1',str(OUT/(name+'-contact.jpg'))],check=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','55','-i',str(path),'-frames:v','1','-vf','scale=360:-2',str(OUT/(name+'-end.jpg'))],check=True)
        print(name, 'download and decoding verified', total, flush=True)
    except Exception as error:
        report.append({'name':name,'error':type(error).__name__ + ': ' + str(error)})
        print(name, type(error).__name__, str(error), flush=True)
(OUT/'report.json').write_text(json.dumps(report, indent=2))
if any('error' in entry for entry in report):
    raise SystemExit(1)
