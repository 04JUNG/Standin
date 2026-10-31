import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRelease} from '../src/lib/releases.ts';
import {campaignCreative} from '../src/lib/acquisition.ts';
const base='https://github.com/04JUNG/Standin-client/releases/download/';
function fixture(version='0.2.8') {
  const assets=[];
  for (const creative of ['meta-hook-a','meta-poster-a','']) for (const suffix of ['x64-setup.exe','universal.dmg']) {
    const name=`Standin_${version}_${creative ? creative+'_' : ''}${suffix}`;
    assets.push({name,size:100,browser_download_url:base+`v${version}/`+name});
  }
  return {tag_name:'v'+version,draft:false,prerelease:false,assets};
}
test('both ads choose shared installers while generic downloads remain neutral regardless of asset order',()=>{
  const release=parseRelease(fixture());
  assert.equal(release.assets.length,2);
  assert.ok(release.assets.every(asset=>!asset.name.includes('meta-')));
  for(const creative of ['meta-poster-a','meta-hook-a']) {
    const href=`https://www.standinpose.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=open-beta&utm_content=${creative}&fbclid=private`;
    const downloads=release.campaignAssets[campaignCreative(href)];
    assert.equal(downloads.length,2);
    assert.ok(downloads.every(asset=>asset.name.includes(creative)&&!asset.url.includes('private')));
  }
});
test('partial, duplicated, foreign-host and old-version packages do not claim automatic handoff',()=>{
  const partial=fixture(); partial.assets.shift();
  assert.equal(parseRelease(partial).campaignAssets['meta-hook-a'],undefined);
  const foreign=fixture(); foreign.assets[0].browser_download_url='https://attacker.invalid/file.exe';
  assert.equal(parseRelease(foreign).campaignAssets['meta-hook-a'],undefined);
  const duplicate=fixture(); duplicate.assets.push(duplicate.assets[0]);
  assert.equal(parseRelease(duplicate).campaignAssets['meta-hook-a'],undefined);
  assert.deepEqual(parseRelease(fixture('0.2.7')).campaignAssets,{});
  const draft=fixture(); draft.draft=true;
  assert.throws(()=>parseRelease(draft));
});
