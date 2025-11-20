'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Mic, Loader2, CheckCircle2, Sparkles } from 'lucide-react'

const WEBHOOK_URL = 'https://n8n.businesshunt.site/webhook-test/03c98e6f-d45a-4848-b0bb-34085bf1801e'

interface ImprovisationGeneratorProps {
  lang: 'en' | 'fr'
}

export default function ImprovisationGenerator({ lang }: ImprovisationGeneratorProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [videoTitle, setVideoTitle] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState('')
  const [finalPlan, setFinalPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const t = {
    fr: {
      title: 'Générateur de Plan Improvisation',
      subtitle: 'IA crée votre structure de vidéo en 2 étapes',
      step1Title: 'Étape 1 : Quel est le titre de votre vidéo ?',
      step1Placeholder: 'Ex: Comment automatiser son business avec l\'IA',
      step1Button: 'Générer les questions',
      step2Title: 'Étape 2 : Répondez aux questions',
      step2Placeholder: 'Collez ici votre transcript, post LinkedIn, article de blog... ou cliquez sur le micro pour parler directement !',
      step2Button: 'Générer la structure',
      micButton: 'Enregistrer ma réponse',
      stopRecording: 'Arrêter l\'enregistrement',
      processing: 'Traitement en cours...',
      questionsReceived: 'Questions personnalisées reçues :',
      finalPlanTitle: '🎬 Votre Plan de Tournage',
      backToStep1: 'Nouveau plan',
      loading: 'Génération...',
    },
    en: {
      title: 'Improvisation Plan Generator',
      subtitle: 'AI creates your video structure in 2 steps',
      step1Title: 'Step 1: What\'s your video title?',
      step1Placeholder: 'Ex: How to automate your business with AI',
      step1Button: 'Generate Questions',
      step2Title: 'Step 2: Answer the questions',
      step2Placeholder: 'Paste your transcript, LinkedIn post, blog article... or click the mic to speak directly!',
      step2Button: 'Generate Structure',
      micButton: 'Record my answer',
      stopRecording: 'Stop recording',
      processing: 'Processing...',
      questionsReceived: 'Personalized questions received:',
      finalPlanTitle: '🎬 Your Shooting Plan',
      backToStep1: 'New plan',
      loading: 'Generating...',
    }
  }

  const text = t[lang]

  // Step 1: Generate questions from video title
  const generateQuestions = async () => {
    if (!videoTitle.trim()) return

    setLoading(true)
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: 1,
          videoTitle: videoTitle 
        })
      })

      const data = await response.text()
      
      // Parse the questions (assuming they come as numbered list)
      const questionList = data.split('\n').filter(line => /^\d+\./.test(line.trim()))
      setQuestions(questionList)
      setStep(2)
    } catch (error) {
      console.error('Error generating questions:', error)
      alert('Erreur lors de la génération des questions')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Generate final plan from answers
  const generateFinalPlan = async () => {
    if (!answers.trim()) return

    setLoading(true)
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: 2,
          videoTitle: videoTitle,
          questions: questions,
          answers: answers 
        })
      })

      const data = await response.text()
      setFinalPlan(data)
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Erreur lors de la génération du plan')
    } finally {
      setLoading(false)
    }
  }

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        // TODO: Send audio to transcription service or webhook
        // For now, just notify user
        alert('Enregistrement terminé. Transcription en cours...')
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Impossible d\'accéder au microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const resetGenerator = () => {
    setStep(1)
    setVideoTitle('')
    setQuestions([])
    setAnswers('')
    setFinalPlan('')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      {/* Left side - Content */}
      <div>
        <div className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/30 text-empire text-xs font-semibold mb-4">
          🎯 {lang === 'fr' ? 'IMPROVISATION' : 'IMPROVISATION'}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{text.title}</h3>
        <p className="text-lg text-neutral-300 mb-6">{text.subtitle}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'IA génère 7 questions personnalisées' : 'AI generates 7 personalized questions'}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'Répondez par texte ou vocalement' : 'Answer via text or voice'}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'Obtenez mindmap + fiche tournage' : 'Get mindmap + shooting guide'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
          <p className="text-sm font-semibold text-empire mb-1 flex items-center gap-2">
            <Sparkles size={14} />
            {lang === 'fr' ? '✨ Parfait pour :' : '✨ Perfect for:'}
          </p>
          <p className="text-sm text-neutral-300">
            {lang === 'fr' 
              ? 'Créateurs qui veulent une structure claire avant de filmer'
              : 'Creators who want a clear structure before filming'}
          </p>
        </div>
      </div>

      {/* Right side - Interactive Generator */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        {/* Step 1: Video Title Input */}
        {step === 1 && !finalPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-empire font-semibold mb-4">
              <FileText size={20} />
              <span>{text.step1Title}</span>
            </div>
            
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder={text.step1Placeholder}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire/50 transition-colors"
              disabled={loading}
            />

            <button
              onClick={generateQuestions}
              disabled={!videoTitle.trim() || loading}
              className="w-full px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {text.loading}
                </>
              ) : (
                text.step1Button
              )}
            </button>
          </motion.div>
        )}

        {/* Step 2: Questions Display + Answer Input */}
        {step === 2 && !finalPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Display questions */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-empire mb-3">{text.questionsReceived}</p>
              <div className="space-y-2 max-h-40 overflow-y-auto text-xs text-neutral-300 bg-black/30 p-3 rounded-lg border border-white/5">
                {questions.map((q, i) => (
                  <p key={i} className="leading-relaxed">{q}</p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-empire font-semibold mb-2">
              <Mic size={20} />
              <span>{text.step2Title}</span>
            </div>

            <textarea
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder={text.step2Placeholder}
              rows={8}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-empire/50 transition-colors resize-none"
              disabled={loading}
            />

            <div className="flex gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 px-4 py-3 border-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isRecording 
                    ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                    : 'border-empire/50 text-empire hover:bg-empire/10'
                }`}
                disabled={loading}
              >
                <Mic size={18} className={isRecording ? 'animate-pulse' : ''} />
                {isRecording ? text.stopRecording : text.micButton}
              </button>
            </div>

            <button
              onClick={generateFinalPlan}
              disabled={!answers.trim() || loading}
              className="w-full px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {text.loading}
                </>
              ) : (
                text.step2Button
              )}
            </button>

            <button
              onClick={resetGenerator}
              className="w-full px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              ← {text.backToStep1}
            </button>
          </motion.div>
        )}

        {/* Final Plan Display */}
        {finalPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-empire font-semibold mb-4">
              <Sparkles size={20} />
              <span>{text.finalPlanTitle}</span>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/5 max-h-96 overflow-y-auto">
              <pre className="text-xs text-neutral-200 whitespace-pre-wrap font-sans leading-relaxed">
                {finalPlan}
              </pre>
            </div>

            <button
              onClick={resetGenerator}
              className="w-full px-6 py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              {text.backToStep1}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}




