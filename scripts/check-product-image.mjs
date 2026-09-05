import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {compressProductImage,productImageJpeg,MAX_PRODUCT_IMAGE_CHARS} from '../src/lib/compressProductImage.ts';
let closed=0,draws=[],attempts=[],failCanvas=false,encodedType='image/webp';
const bitmap={width:1600,height:800,close(){closed++}};
globalThis.createImageBitmap=async()=>bitmap;
let accept=(w,q)=>w===480&&q===0.94;
let pixelMode='opaque',cropDraw;
globalThis.document={createElement(){const canvas={width:0,height:0,getContext(){return failCanvas?null:{fillRect(){assert.fail('Source transparency must not be flattened')},drawImage(...args){if(args.length===9){draws.push([canvas.width,canvas.height]);cropDraw=args.slice(1)}},getImageData(){const data=new Uint8ClampedArray(canvas.width*canvas.height*4);if(pixelMode==='opaque')data.fill(255);else if(pixelMode==='subject'){for(let y=100;y<300;y++)for(let x=150;x<250;x++)data[(y*canvas.width+x)*4+3]=255;data[3]=2;}return {data}}}},toDataURL(type,q){assert.equal(type,'image/webp');attempts.push([canvas.width,q]);return `data:${encodedType};base64,`+'A'.repeat(accept(canvas.width,q)?100:MAX_PRODUCT_IMAGE_CHARS)}};return canvas}};
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
failCanvas=false;accept=()=>true;bitmap.width=400;bitmap.height=400;pixelMode='subject';
await compressProductImage({type:'image/png'});
assert.deepEqual(cropDraw.slice(0,4),[149,99,102,202]);
assert.equal(draws.at(-1)[0],draws.at(-1)[1],'Transparent subjects use square frames');
assert(cropDraw[4]>0&&cropDraw[5]>0,'Leave a safety margin');
assert.equal(cropDraw[6]/cropDraw[7],102/202,'Never stretch a product');
assert(cropDraw[6]<=102&&cropDraw[7]<=202,'Do not upscale source pixels');
pixelMode='empty';await assert.rejects(compressProductImage({type:'image/png'}),/no visible product/);
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
console.log('WebP quality, size cap, JPEG compatibility, transparency preservation, no upscale, encoder format, and cleanup checks passed.');
