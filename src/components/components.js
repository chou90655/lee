function install(Vue) {
  Vue.component(this.name, this)
}
export const icon = {
  install,
  name: 'icon',
  props: {
    href: String
  },
  render(h) {
    return h(
      'svg',
      { class: 'l_icon', attrs: { 'aria-hidden': true } },
      [h('use', { attrs: { 'xlink:href': '#iconicon_' + this.href } })]
    )
  }
}

export const heade = {
  install,
  name: 'heade',
  props: {
    title: String
  },
  render(h) {
    const style = {
      height: '48px',
      lineHeight: '48px',
      position: 'relative',
      textAlign: 'center',
      fontSize: '18px'
    }
    const iStyle = {
      position: 'absolute',
      height: '20px',
      width: '20px',
      padding: '4px 6px',
      top: 'calc(50% - 14px)'
    }
    return h(
      'div',
      { class: 't_b _head', style },
      [
        h(icon, { style: { ...iStyle, left: '4px' }, props: { href: 'back' }, nativeOn: { click: () => this.$router.back() } }),
        h('h3', this.title),
        this.title.includes('走势') ? h(icon, { style: { ...iStyle, right: '6px' }, props: { href: 'shezhi' }, nativeOn: { click: () => this.$emit('config') } }) : ''
      ]
    )
  }
}
