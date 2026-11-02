'use client'
import { motion, useTransform, type MotionValue } from 'framer-motion'
type Point=[number,number]
export default function FlowConnection({p,start,duration=.015,from,c1,c2,to,loop=true}:{p:MotionValue<number>;start:number;duration?:number;from:Point;c1:Point;c2:Point;to:Point;loop?:boolean}){
 const t=useTransform(p,v=>Math.max(0,Math.min(1,(v-start)/duration)))
 const opacity=useTransform(t,[0,.08,.9,1],[0,1,1,0])
 const settled=useTransform(t,[.98,1],[0,1])
 const x=useTransform(t,t=>(1-t)**3*from[0]+3*(1-t)**2*t*c1[0]+3*(1-t)*t*t*c2[0]+t**3*to[0])
 const y=useTransform(t,t=>(1-t)**3*from[1]+3*(1-t)**2*t*c1[1]+3*(1-t)*t*t*c2[1]+t**3*to[1])
 const d=`M${from.join(' ')} C${c1.join(' ')},${c2.join(' ')},${to.join(' ')}`
 return <g><path d={d} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".28"/><motion.path d={d} fill="none" stroke="#b5d948" strokeWidth="1" vectorEffect="non-scaling-stroke" style={{pathLength:t,opacity:.65}}/><motion.circle r="4" fill="#dafc68" cx={x} cy={y} style={{opacity}}/>{loop&&<motion.g style={{opacity:settled}}><circle r="2.8" fill="#cdec76"><animateMotion dur="3.5s" path={d} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.85;1" calcMode="linear"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.75;1" dur="3.5s" repeatCount="indefinite"/></circle></motion.g>}</g>
}
