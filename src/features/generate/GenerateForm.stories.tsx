import preview from '../../../.storybook/preview'
import { GenerateForm } from './GenerateForm'

const meta = preview.meta({
  title: 'Generate form',
  component: GenerateForm,
  decorators: [(Story) => <div className="max-w-xl p-8 font-now"><Story /></div>],
})

/** With the real API: submitting navigates to the API's GitHub sign-in with the cut-off. */
export const Connect = meta.story({})

/** A custom date. */
export const CustomCutoff = meta.story({ args: { initialCutoff: '2024-06-01' } })

/** Sent back by the API with ?error=invalid-cutoff. */
export const InvalidCutoff = meta.story({ args: { initialCutoff: '2024-02-30', error: 'invalid-cutoff' } })
