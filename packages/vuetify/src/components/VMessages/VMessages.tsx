// Styles
import './VMessages.sass'

// Components
import { VSlideYTransition } from '@/components/transitions'

// Composables
import { makeComponentProps } from '@/composables/component'
import { makeTransitionProps, MaybeTransition } from '@/composables/transition'
import { useTextColor } from '@/composables/color'

// Utilities
import { computed } from 'vue'
import { genericComponent, propsFactory, useRender, wrapInArray } from '@/util'

// Types
import type { PropType } from 'vue'

export type VMessageSlot = {
  message: string
}

export type VMessagesSlots = {
  message: [VMessageSlot]
}

export const makeVMessagesProps = propsFactory({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },

  ...makeComponentProps(),
  ...makeTransitionProps({
    transition: {
      component: VSlideYTransition,
      leaveAbsolute: true,
      group: true,
    },
  }),
}, 'v-messages')

export const VMessages = genericComponent<VMessagesSlots>()({
  name: 'VMessages',

  props: makeVMessagesProps(),

  setup (props, { slots }) {
    const messages = computed(() => wrapInArray(props.messages))
    const { textColorClasses, textColorStyles } = useTextColor(computed(() => props.color))

    useRender(() => (
      <MaybeTransition
        transition={ props.transition }
        tag="div"
        class={[
          'v-messages',
          textColorClasses.value,
          props.class,
        ]}
        style={[
          textColorStyles.value,
          props.style,
        ]}
        role="alert"
        aria-live="polite"
      >
        { props.active && (
          messages.value.map((message, i) => (
            <div
              class="v-messages__message"
              key={ `${i}-${messages.value}` }
            >
              { slots.message ? slots.message({ message }) : message }
            </div>
          ))
        )}
      </MaybeTransition>
    ))

    return {}
  },
})

export type VMessages = InstanceType<typeof VMessages>
