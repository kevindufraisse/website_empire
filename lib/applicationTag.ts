import { createOrUpdateContact, addTagToContact } from '@/lib/systemeio'

/**
 * Candidature Academy complète → tag Systeme.io CANDIDATURE_ACADEMY_RECUE.
 *
 * Chez Systeme.io, la règle « tag ajouté → s'abonner à la campagne Empire
 * Academy - Candidature reçue : prépare ton appel » (3 emails : accusé de
 * réception, comment le dossier est lu, preuves) part de ce tag.
 *
 * L'identifiant est celui du tag dans le compte Systeme.io (vérifié le
 * 21 novembre 2026). `SYSTEMEIO_TAG_CANDIDATURE` permet de le changer sans
 * redéployer le code.
 */
export const CANDIDATURE_TAG_ID = Number(process.env.SYSTEMEIO_TAG_CANDIDATURE) || 2307855

/** L'étape à laquelle la candidature est complète. */
export const FINAL_STEP = 6

export interface ApplicationBeforeUpdate {
  step_completed?: number | null
  email?: string | null
  first_name?: string | null
  last_name?: string | null
}

/**
 * Le tag ne part qu'au PREMIER passage à l'étape finale : un candidat qui
 * revient sur sa candidature terminée et la renvoie ne doit pas être réinscrit
 * à la séquence. `prev` est l'état lu avant l'écriture de cette étape.
 */
export function shouldTagApplication(prev: ApplicationBeforeUpdate | null | undefined, stepCompleted: unknown): boolean {
  if (Number(stepCompleted) < FINAL_STEP || !Number.isFinite(Number(stepCompleted))) return false
  if (!prev || !prev.email || !String(prev.email).includes('@')) return false
  return (Number(prev.step_completed) || 0) < FINAL_STEP
}

/**
 * Crée (ou retrouve) le contact et pose le tag. Ne lève jamais : la candidature
 * est déjà enregistrée, un souci Systeme.io ne doit rien casser côté formulaire.
 */
export async function tagCompletedApplication(prev: ApplicationBeforeUpdate): Promise<boolean> {
  try {
    const contact = await createOrUpdateContact({
      email: String(prev.email).trim().toLowerCase(),
      firstName: prev.first_name || undefined,
      lastName: prev.last_name || undefined,
      locale: 'fr',
    })
    await addTagToContact(contact.id, CANDIDATURE_TAG_ID)
    return true
  } catch (err) {
    console.error('[applications] tag Systeme.io CANDIDATURE_ACADEMY_RECUE', err)
    return false
  }
}
