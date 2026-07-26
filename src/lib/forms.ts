// Hook compartido para formularios de captura de lead vía FormSubmit.co.
// Extraído tras detectar que Contact.tsx, Resources.tsx (newsletter) y ahora
// HeroLeadWidget.tsx repetían el mismo trío fetch + estado + validación de
// email. Contact.tsx y Resources.tsx NO se han migrado a este hook: ambos ya
// funcionan y migrarlos no aporta nada al alcance de esta tarea, solo riesgo
// de regresión en dos formularios que ya están en producción. Este hook es
// para código NUEVO; si en el futuro se refactorizan los otros dos, este es
// el sitio donde centralizar la lógica.
import { useCallback, useState } from 'react';
import { FORMSUBMIT_ENDPOINT } from './company';

// Reexportado, no redeclarado: el endpoint depende de a qué buzón entrega, es
// decir de un dato de empresa, y ese vive ahora en un solo sitio
// (src/lib/company.ts). Antes el correo estaba escrito a mano aquí Y en
// Contact.tsx Y en el @graph de index.html; cambiarlo obligaba a acertar en
// los tres. Se mantiene el nombre `FORM_ENDPOINT` para no tocar consumidores.
export const FORM_ENDPOINT = FORMSUBMIT_ENDPOINT;

// Mismo regex que Contact.tsx — validación de email en cliente, no exhaustiva
// (RFC completo no vale la pena aquí), solo atrapa los typos obvios.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Valida un email y devuelve el mensaje de error (en español, listo para
 * mostrar) o `undefined` si es válido. */
export function validateEmail(email: string): string | undefined {
    const trimmed = email.trim();
    if (!trimmed) return 'Déjanos un email para responderte.';
    if (!EMAIL_RE.test(trimmed)) return 'Ese email no parece válido. Revísalo.';
    return undefined;
}

interface SubmitResult {
    ok: boolean;
}

/**
 * Estado + envío de un formulario de captura de lead a FormSubmit.co.
 * No incluye validación de campos (cada formulario tiene los suyos) — solo
 * el ciclo de vida idle → submitting → success/error y el fetch en sí.
 */
export function useLeadForm() {
    const [status, setStatus] = useState<LeadFormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const submit = useCallback(async (body: Record<string, string>): Promise<SubmitResult> => {
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setStatus('success');
                return { ok: true };
            }
            const json = await res.json().catch(() => ({}));
            setErrorMsg(json?.errors?.[0]?.message || 'No se pudo enviar. Vuelve a intentarlo en un momento.');
            setStatus('error');
            return { ok: false };
        } catch {
            setErrorMsg('Fallo de red. Revisa tu conexión y vuelve a intentarlo.');
            setStatus('error');
            return { ok: false };
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setErrorMsg('');
    }, []);

    return { status, errorMsg, submit, reset };
}
