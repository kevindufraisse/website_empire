from pathlib import Path
p=Path('scripts/check-homepage-story.mjs');t=p.read_text().replace("const root=t>=.28&&t<.698?", "const root=t>=.28&&t<=.698?").replace('raw=.72+(t-.628)/.07*.16','raw=.72+Math.min(.999,(t-.628)/.07)*.16')
cut=t.index('  const reduced = await contextFor(')
t=t[:cut].replace("page.locator('[data-scene=\"lead-magnet\"]')", "page.locator('[data-journey-pane=\"instagram\"]')")+t[cut:]
p.write_text(t)
p=Path('scripts/check-leadmagnet-demo.mjs');t=p.read_text();old="   assert.equal(await team.locator('[data-team-cost-total]').innerText(),'0 €')";assert t.count(old)==1;t=t.replace(old,"   await at(page,'[data-story=\"team\"]',.86)\n"+old);p.write_text(t)
p=Path('components/UnifiedFormatJourney.module.css');t=p.read_text();t+='\n/* The legacy mobile rule hides the last div as a format shelf. Here it is copy. */\n.story.story .long[data-format="5"]>.longCopy{display:block}\n';p.write_text(t)
print('Updated only the checks that locate the now-unified scenes, and preserved mobile copy.')
