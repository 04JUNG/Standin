import test from 'node:test';
import assert from 'node:assert/strict';
import {appCampaignLink,supportsAcquisition} from '../src/lib/acquisition.ts';
const base='https://www.standinpose.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=open-beta&utm_content=meta-poster-a';
test('handoff contains only allowed labels, never fbclid or cookies',()=>{
  assert.equal(appCampaignLink(base+'&fbclid=private'),'standin://campaign?source=instagram&campaign=open-beta&creative=meta-poster-a');
  for(const value of [base.replace('meta-poster-a','unknown'),base+'&utm_content=meta-hook-a',base.replace('instagram','google'),'bad']) assert.equal(appCampaignLink(value),null);
});
test('old and prerelease installers never display unsupported handoff',()=>{
  for(const tag of ['v0.2.3','v0.2.4','v0.2.5-beta','staging-0.2.5','bad']) assert.equal(supportsAcquisition(tag),false);
  for(const tag of ['v0.2.5','v0.3.0','v1.0.0']) assert.equal(supportsAcquisition(tag),true);
});
