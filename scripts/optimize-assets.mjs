import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root='dist';
const images=['saad-portrait.png.png','team-coordination.png.png','product-competitor-research.png','ebay-listings-redacted.png','ebay-seller-overview-redacted.png.png'];
const logos={
  "amazon": "https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg",
  "ebay": "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
  "etsy": "https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg",
  "walmart": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Walmart_logo_%282025%29.svg",
  "temu": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Temu_logo.svg",
  "daraz": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Daraz_Logo.png",
  "poshmark": "https://upload.wikimedia.org/wikipedia/commons/4/44/Poshmark_logo.png",
  "tiktok-shop": "https://files.brandlogos.net/svg/4yu3BbTeAj/TikTok_Shop-O011PhGgS_brandlogos.net.svg"
};
let html=await readFile(path.join(root,'index.html'),'utf8');
const files=await import('node:fs/promises').then(fs=>fs.readdir(path.join(root,'assets')));
const replaceAll=async(from,to)=>{html=html.split(from).join(to);for(const f of files.filter(f=>f.endsWith('.css'))){const target=path.join(root,'assets',f);const css=await readFile(target,'utf8');if(css.includes(from))await writeFile(target,css.split(from).join(to));}};
for(const name of images){try{const input=path.join(root,name);const output=name.replace(/(?:\.png)+$/i,'.webp');const data=await sharp(input).resize({width:1800,withoutEnlargement:true}).webp({quality:name.includes('portrait')?88:90,alphaQuality:100}).toBuffer();const before=(await stat(input)).size;if(data.length<before){await writeFile(path.join(root,output),data);await replaceAll('/'+name,'/'+output);console.log('[assets] '+name+' '+before+' -> '+data.length+' bytes');}}catch(e){console.warn('[assets] Keeping original '+name+': '+e.message);}}
await mkdir(path.join(root,'logos'),{recursive:true});
await Promise.all(Object.entries(logos).map(async([name,url])=>{try{const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'SaadPortfolioAssetBuild/1.0 (portfolio asset optimization)'}});if(!response.ok)throw Error('HTTP '+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>3000000)throw Error('Oversized logo');const data=await sharp(bytes,{density:144}).resize({width:400,height:180,fit:'inside',withoutEnlargement:true}).webp({quality:95}).toBuffer();await writeFile(path.join(root,'logos',name+'.webp'),data);html=html.split(url).join('/logos/'+name+'.webp');if(name==='daraz')html=html.split('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Daraz_Logo.png/330px-Daraz_Logo.png').join('/logos/daraz.webp');console.log('[logos] Local '+name+' ('+data.length+' bytes)');}catch(e){console.warn('[logos] Keeping original source for '+name+': '+e.message);}}));
await writeFile(path.join(root,'index.html'),html);
