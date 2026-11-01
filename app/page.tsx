import dynamic from 'next/dynamic'
import HomeHero from '@/components/sections/HomeHero'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import HomeApplySection from '@/components/sections/HomeApplySection'
import FeaturedInSection from '@/components/FeaturedInSection'
import FormulaBar from '@/components/HomeFormula'
import HomeMasterclassGate from '@/components/sections/HomeMasterclassGate'
import HomeDetails from '@/components/sections/HomeDetails'
import './home.css'
const HomeDemoSection=dynamic(()=>import('@/components/sections/HomeDemoSection'))
const TestimonialsSection=dynamic(()=>import('@/components/sections/TestimonialsSection'))
const QuickWinsSection=dynamic(()=>import('@/components/sections/QuickWinsSection'))
const FAQSection=dynamic(()=>import('@/components/sections/FAQSection'))
export default function Page(){return <main className="home-page"><HomeHero/><div className="home-press"><FeaturedInSection/></div><div className="home-legacy home-creators"><TopCreatorsSection compact/></div><div className="home-legacy"><HomeMasterclassGate/></div><div id="formula-message"><HomeDemoSection/></div><div id="formula-time"><div id="formula-cost" className="home-legacy home-comparison"><QuickWinsSection/></div></div><HomeDetails/><div className="home-legacy home-testimonials"><TestimonialsSection/></div><div id="formula-apply" className="home-legacy"><HomeApplySection/></div><div className="home-legacy"><FAQSection variant="home"/></div><FormulaBar/></main>}
