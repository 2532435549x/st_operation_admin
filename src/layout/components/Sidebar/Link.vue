<!--
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditors: wangyun
 * @LastEditTime: 2019-08-30 11:33:55
 -->

<template>
  <!-- eslint-disable vue/require-component-is-->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    linkProps(url) {
      if (this.isExternalLink(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
