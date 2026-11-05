'use client'
import { motion, type MotionValue } from 'framer-motion'
import { Play, Heart, MessageCircle, Send, Bookmark, ThumbsUp, Repeat2, BarChart3, Share2 } from 'lucide-react'
import s from './PlatformMetrics.module.css'
export default function PlatformMetrics({index,count}:{index:number;count:MotionValue<string>}){
 const network=['instagram','linkedin','youtube','tiktok','threads','twitter','facebook'][index]
 return <div className={s.metrics} data-network={network}>
  <div className={s.actions}>
   {index===1||index===2||index===6?<ThumbsUp/>:<Heart/>}<MessageCircle/>{index===4||index===5?<Repeat2/>:index===2||index===6?<Share2/>:<Send/>}{index===5?<BarChart3/>:<Bookmark/>}
  </div>
  <div className={s.count}><span>{index===1||index===5?<BarChart3/>:<Play fill="currentColor"/>}</span><div><motion.b data-metric-value>{count}</motion.b><small>{index===1?'impressions':'vues'}</small></div></div>
  <span className={s.insight}>{['Voir les statistiques','Voir les statistiques du post','Performances de la vidéo','Données analytiques','Voir l’activité','Statistiques de la publication','Statistiques du Reel'][index]}</span>
 </div>
}
