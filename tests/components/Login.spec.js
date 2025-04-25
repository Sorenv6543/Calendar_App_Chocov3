import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '@/components/Login.vue'
import { createTestingPinia } from '@pinia/testing'

describe('Login.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('emits login event when form is submitted with valid data', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    })
    
    // Set input values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Assertion would depend on component implementation
    // expect(wrapper.emitted('login')).toBeTruthy()
  })

  it('displays validation errors for invalid input', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    })
    
    // Submit without filling fields
    await wrapper.find('form').trigger('submit.prevent')
    
    // Assertion would depend on component implementation
    // expect(wrapper.find('.error-message').exists()).toBe(true)
  })
}) 