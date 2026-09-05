import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {compressProductImage,productImageJpeg,MAX_PRODUCT_IMAGE_CHARS} from '../src/lib/compressProductImage.ts';
let closed=0,draws=[],attempts=[],fill='',failCanvas=false,encodedType='image/webp';
const bitmap={width:1600,height:800,close(){closed++}};
globalThis.createImageBitmap=async()=>bitmap;
let accept=(w,q)=>w===480&&q===0.94;
globalThis.document={createElement(){const canvas={width:0,height:0,getContext(){return failCanvas?null:{set fillStyle(v){fill=v},fillRect(){assert.equal(fill,'#ffffff')},drawImage(){draws.push([canvas.width,canvas.height])}}},toDataURL(type,q){assert.equal(type,'image/webp');attempts.push([canvas.width,q]);return `data:${encodedType};base64,`+'A'.repeat(accept(canvas.width,q)?100:MAX_PRODUCT_IMAGE_CHARS)}};return canvas}};
await compressProductImage({type:'image/png'});assert.deepEqual(draws,[[480,240]]);assert.deepEqual(attempts,[[480,0.94]]);assert.equal(closed,1);
draws=[];attempts=[];accept=(w,q)=>w===480&&q===0.90;
await compressProductImage({type:'image/jpeg'});assert.deepEqual(attempts,[[480,0.94],[480,0.90]]);
draws=[];attempts=[];accept=w=>w===384;
await compressProductImage({type:'image/jpeg'});assert.deepEqual(draws,[[480,240],[384,192]]);assert.equal(closed,3);
bitmap.width=40;bitmap.height=20;draws=[];accept=()=>true;
await compressProductImage({type:'image/webp'});assert.deepEqual(draws,[[40,20]]);
encodedType='image/png';await assert.rejects(compressProductImage({type:'image/png'}),/still too large/);
encodedType='image/webp';accept=()=>false;await assert.rejects(compressProductImage({type:'image/png'}),/still too large/);assert.equal(closed,6);
failCanvas=true;await assert.rejects(compressProductImage({type:'image/png'}),/Could not prepare/);assert.equal(closed,7);
await assert.rejects(compressProductImage({type:'text/plain'}),/JPEG or PNG/);
for(const type of ['jpeg','webp']){
  const valid=`data:image/${type};base64,`+'A'.repeat(24000);
  assert.equal(productImageJpeg(valid),valid);
  assert.throws(()=>productImageJpeg(valid+'A'.repeat(MAX_PRODUCT_IMAGE_CHARS)),/too large/);
}
assert.equal(productImageJpeg(undefined),undefined);
assert.throws(()=>productImageJpeg('data:image/png;base64,AAAA'),/too large/);
// Bundle the actual backend validator without connecting to or reseeding a database.
const bundle=await build({entryPoints:['convex/lib/management.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {cleanProductImageJpeg}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
for(const value of [undefined,'data:image/jpeg;base64,AAAA','data:image/webp;base64,'+'A'.repeat(24000)]){
  assert.equal(cleanProductImageJpeg(value),productImageJpeg(value));
}
for(const value of ['data:image/png;base64,AAAA','data:image/webp;base64,'+'A'.repeat(MAX_PRODUCT_IMAGE_CHARS)]){
  assert.throws(()=>cleanProductImageJpeg(value));assert.throws(()=>productImageJpeg(value));
}
console.log('WebP quality, size cap, JPEG compatibility, white background, no upscale, encoder format, and cleanup checks passed.');
