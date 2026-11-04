"""Prepare the approved comparison from the exact two supplied MP4 files.
Only resizing/compression/trimming: no invented montage, synthetic voice or imagery.
The original is a brief silent reference excerpt; Kevin's result is displayed separately.
"""
import hashlib, json, pathlib, subprocess
source=pathlib.Path('artifacts/leadmagnet-media')
out=pathlib.Path('public/demo')
out.mkdir(exist_ok=True)
records=[]
for name,label,start,duration in [('original','source',6,6),('kevin','result',6,16)]:
    raw=source/(name+'.mp4')
    stem='leadmagnet-'+label+'-20261104'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(raw),'-t',str(duration),'-map','0:v:0','-an','-vf','scale=480:854:force_original_aspect_ratio=decrease,pad=480:854:(ow-iw)/2:(oh-ih)/2','-r','25','-c:v','libx264','-preset','medium','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(out/(stem+'.mp4'))],check=True)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','1','-i',str(out/(stem+'.mp4')),'-frames:v','1','-q:v','3',str(out/(stem+'.jpg'))],check=True)
    records.append({'role':label,'suppliedFileSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'startSeconds':start,'durationSeconds':duration,'video':'/demo/'+stem+'.mp4','poster':'/demo/'+stem+'.jpg','bytes':(out/(stem+'.mp4')).stat().st_size})
(out/'leadmagnet-pair-20261104.json').write_text(json.dumps({'source':'Two direct MP4 links supplied by Kevin in the conversation on 2026-11-04.','resultReel':'https://www.instagram.com/reel/De1ncaACJuN/','keyword':'CLAUDE','processing':'Silent excerpts, trimmed and resized only; the two original edits are preserved.','conversation':'Illustrative only. No Instagram message is sent and no real resource delivery is asserted.','files':records},indent=2)+'\n')
print(json.dumps(records,indent=2))
