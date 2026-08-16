#!/usr/bin/env python3
"""Validate every JSON-LD block on this site against the REAL schema.org
vocabulary (domainIncludes), catching property/type violations that Google's
Rich Results Test silently ignores because it only checks properties tied to a
rich result it supports. Run: python3 tools/validate-schema.py

Caches the vocabulary in the system temp dir, downloading it once (~1.5MB).
"""
import os,tempfile,urllib.request
VOCAB=os.path.join(tempfile.gettempdir(),"schemaorg-current-https.jsonld")
if not os.path.exists(VOCAB):
    print("downloading schema.org vocabulary (once)...")
    urllib.request.urlretrieve("https://schema.org/version/latest/schemaorg-current-https.jsonld",VOCAB)
import json,re,glob,sys
d=json.load(open(VOCAB)); g=d['@graph']; byid={n['@id']:n for n in g}
def lst(v): return v if isinstance(v,list) else ([v] if v is not None else [])
def ids(n,k): return sorted(x['@id'].replace('schema:','') for x in lst(n.get(k)) if isinstance(x,dict) and '@id' in x)
def anc(c,seen=None):
    seen=seen if seen is not None else []
    n=byid.get('schema:'+c)
    if not n: return seen
    for p in ids(n,'rdfs:subClassOf'):
        if p not in seen: seen.append(p); anc(p,seen)
    return seen
KEY={'@type','@id','@context','@graph'}
errs=[];okc=0
def walk(node,path,f):
    global okc
    if isinstance(node,list):
        for i,x in enumerate(node): walk(x,f'{path}[{i}]',f)
        return
    if not isinstance(node,dict): return
    if '@graph' in node:
        walk(node['@graph'],path+'.@graph',f)
    types=lst(node.get('@type'))
    if not types:
        for k,v in node.items():
            if k not in KEY: walk(v,f'{path}.{k}',f)
        return
    chain=set()
    for t in types:
        chain.add(t); chain.update(anc(t))
    for k,v in node.items():
        if k in KEY: continue
        pn=byid.get('schema:'+k)
        if pn is None:
            errs.append(f"{f} {path}.{k}: PROPERTY DOES NOT EXIST"); continue
        dom=set(ids(pn,'schema:domainIncludes'))
        if dom and not (dom & chain):
            errs.append(f"{f} {path}.{k}: illegal on {types}; legal on {sorted(dom)}")
        else: okc+=1
        walk(v,f'{path}.{k}',f)
for f in sorted(glob.glob(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'*.html'))):
    s=open(f,encoding='utf-8').read()
    for i,b in enumerate(re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>',s,re.S)):
        walk(json.loads(b),'$',f.split('/')[-1]+f'#{i}')
print(f"properties checked OK: {okc}")
print(f"VIOLATIONS: {len(errs)}")
for e in errs: print("  X",e)
