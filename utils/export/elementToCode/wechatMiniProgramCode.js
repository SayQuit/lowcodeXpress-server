const prettier = require('prettier');
const { toCamelCase, capitalizeFirstLetter } = require('../../str');

const parseWechatMiniProgramCode = async (element, name, lib, variable, event, props, onload) => {
  const wxml = await prettier.format(parseWechatMiniProgramElement(element, variable, props, event), {
    parser: 'html',
    printWidth: 120,
    singleQuote: true,
  });

  const noRequest = event.filter((item) => { return item.type === 'request' }).length === 0

  let data = await prettier.format(parseWechatMiniProgramVariable(variable, props), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  })
  data = data.replace('const data =', "data:").replaceAll(';', ",")

  let properties = await prettier.format(parseWechatMiniProgramProps(props), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });

  properties = properties.replace('const properties =', "properties:").replaceAll(';', ",")

  let get = await prettier.format(parseWechatMiniProgramGet(), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });
  let set = await prettier.format(parseWechatMiniProgramSet(), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });
  let req = await prettier.format((noRequest ? '' : parseRequest()), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });
  let e = await prettier.format(parseWechatMiniProgramEvent(event), {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });


  const methods = `methods:{
    ${(set + get + req + e).replaceAll('function', "").replaceAll('/* prettier-ignore */', ",")}
  }`

  return {
    wxml,
    data,
    properties,
    onload,
    methods

  }
}

function transfromConstToVariable(arr) {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (!isNaN(value)) {
      result += `[${value}]`;
    } else {
      result += (i === 0 ? '' : '.') + value;
    }
  }
  if (result) return `{{item.${result}}}`;
  else return `{{item}}`;
}

const parseWechatMiniProgramElementText = (item, variable, props) => {
  let text = null
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind === 'children') text = `{{state.${v_item.name}}}`
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind === 'children') text = `{{state.${p_item.name}}}`
    }
  })
  if (item.attr && item.attr.children && !text) return item.attr.children
  else return text
}

const parseWechatMiniProgramElementAttribute = (item, variable, props, event) => {
  let attr = ''
  if (Object.keys(item.styleObject).length > 0) attr += ` style=${JSON.stringify(item.style)}`
  const attrArray = []
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind !== 'children') {
        attr += ` ${v_item.bind}="{{state.${v_item.name}}}"`
        attrArray.push(v_item.bind)
      }
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind !== 'children') {
        attr += ` ${p_item.bind}="{{state.${p_item.name}}}"`
        attrArray.push(p_item.bind)
      }
    }
  })
  event.forEach((e_item) => {
    if (e_item.bindElement === item.id && e_item.bindEvent === 'onClick') {
      attr += ` bindtap="${e_item.name}"`
      attrArray.push(e_item.bindEvent)
    }
  })
  for (const key in item.attr) {
    if (attrArray.indexOf(key) === -1 && key !== 'children') {
      if (item.attr[key][0] === '{' && item.attr[key][item.attr[key].length - 1] === '}')
        attr += ` ${key}="${item.attr[key]}"`
      else
        attr += ` ${key}=${JSON.stringify(item.attr[key])}`
      attrArray.push(key)
    }
  }
  if(item.type==='image')attr+= ` mode="widthFix"`
  return attr
}

const parseWechatMiniProgramElement = (element, variable, props, event) => {
  let res = ''

  element.forEach((item) => {
    let el = ''
    if (item.type === 'nest') {
      el += `
        <view${parseWechatMiniProgramElementAttribute(item, variable, props, event)}>
          ${parseWechatMiniProgramElementText(item, variable, props) || parseWechatMiniProgramElement(item.childrenElement, variable, props, event)}
        </view>
      `
    }
    else if (item.type === 'container') { }
    else if (item.type === 'circle') {
      item.target.forEach((t_item) => {
        [...props, ...variable].forEach(v_item => {
          if (v_item.name === item.circleVariableName) {
            match = v_item.value;
          }
        });
        let current = item.circleElement;
        const keys = t_item.toArray
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key]) return
          current = current[key];
        }
        current[keys[keys.length - 1]] = transfromConstToVariable(t_item.fromArray);
        // #0 由circle父元素修改变量名称
      })
      el += `
          <view${parseWechatMiniProgramElementAttribute(item, variable, props, event)}>
            <block wx:for="{{state.${item.circleVariableName}}}" wx:key="index">
              ${parseWechatMiniProgramElement([item.circleElement], variable, props, event)}
            </block>
          </view>
        `
    }
    else el += `<${item.type}${parseWechatMiniProgramElementAttribute(item, variable, props, event)}>${parseWechatMiniProgramElementText(item, variable, props) || ''}</${item.type}>
    `
    res += el
  })

  return res
}


const parseWechatMiniProgramProps = (props) => {
  let res = ''
  props.forEach((item, index) => {
    res += `
    ${item.name}:{
      type:${capitalizeFirstLetter(item.type)},
      value:${JSON.stringify(item.value)}
    }
    `;
    if (index !== item.length - 1) res += ','
  });
  return `const properties ={
    ${res}
  }`

}

const parseWechatMiniProgramVariable = (variable, props) => {

  let res = ''
  variable.forEach(item => {
    const value = JSON.stringify(item.value)
    const name = item.name
    res += `    ${name}:${value},
    `;
  });
  props.forEach(item => {
    const name = item.name
    res += `    ${name},
    `;
  });
  return `const data={
    state:{
      ${res}
    }
  }`
}

const parseWechatMiniProgramEvent = (event) => {
  let func = ''
  event.forEach((item) => {
    let fn = ''
    if (item.type === 'request') {
      fn = `
        const params = {};

        ${JSON.stringify(item.request.params)}.forEach((item) => { const value=this.get(item);if(value)params[item] = this.get(item) })
        this.wxRequest(${JSON.stringify(item.request.url)}, ${JSON.stringify(item.request.method)}, params)
      `
      if (item.request.set) {
        fn += `  .then(( res )=>{ const { data }=res; for(const key in data){ const item=data[key]; this.setState(data) }})
        `
      }
      func += `
      function ${item.name}() {
        ${fn}
      }/* prettier-ignore */`
    }
    else if (item.type === 'custom') {
      fn = item.custom.code
      func += `
      function ${item.name} () {
        ${fn}
      }/* prettier-ignore */`
    }
    else if (item.type === 'setValue') {
      if (item.setValue.useE) fn = `this.set(${JSON.stringify(item.setValue.variable)},${item.setValue.newValue})`
      else fn = `this.set(${JSON.stringify(item.setValue.variable)},${JSON.stringify(item.setValue.newValue)})`
      func += `
        function  ${item.name}  (${item.setValue.useE ? 'e' : ''}) {
        ${fn}
        }/* prettier-ignore */`
    }
  })
  return func
}

const parseWechatMiniProgramGet = () => {
  return `
  function get(key) {
        return this.data.state[key]
  }/* prettier-ignore */`
}


const parseWechatMiniProgramSet = () => {
  return `
      function set(key,value) {
        this.setData({
          state:{
              ...this.data.state,
            [key]:value
          }
        })
      }/* prettier-ignore */
      function setState (state) {
        this.setData({
          state:{
              ...this.data.state,
              ...state
          }
        })
      }/* prettier-ignore */`
}

const parseRequest = () => {
  return `
  function wxRequest (url, method, data) {
      return new Promise((resolve,reject)=>{
        wx.request({
          url,
          method,
          data,
          success:(res)=>{resolve(res.data)},
          fail:(err)=>{reject(err)}
        })
      })
    }/* prettier-ignore */`
}
module.exports = { parseWechatMiniProgramCode };