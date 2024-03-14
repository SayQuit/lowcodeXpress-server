const prettier = require('prettier');
const { toCamelCase, capitalizeFirstLetter } = require('../../str');

const parseVueCode = async (element, name, lib, variable, event, props, onload) => {
  const component = []
  const el = parseVueElement(element, variable, props, event, component)
  const noRequest = event.filter((item) => { return item.type === 'request' }).length === 0
  return prettier.format(`
    <template>
      <fragment>
      ${el}
      </fragment>
    </template>

    <script setup>
      ${parseVueImport(component, lib)}

      ${parseVueProps(props)}

      ${parseVueVariable(variable, props)}

      ${parseVueGet()}

      ${parseVueSet()}

      ${noRequest ? '' : parseRequest()}
      
      ${parseVueEvent(event)}

      onMounted(()=>{ ${onload ? onload + '()' : ''} })


    </script>

    <style></style>
  `, {
    parser: 'vue',
    printWidth: 120,
    singleQuote: true,
  });
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

const parseVueImport = (component, lib) => {
  let res = `
  import { ref, onMounted, defineProps } from 'vue';
  `
  if (component.length) {
    if (lib.includes('ant-design')) {
      res += `import {
        ${component.map(item => { return item.name + ' as ' + item.asName }).join(`,
      `)}
      } from 'ant-design-vue';`
    }
  }
  return res
}

const parseVueElementText = (item, variable, props) => {
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

const parseVueElementAttribute = (item, variable, props, event) => {
  let attr = ''
  if (Object.keys(item.styleObject).length > 0) attr += ` style="${item.style}"`
  const attrArray = []
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind !== 'children') {
        attr += ` :${v_item.bind}="state.${v_item.name}"`
        attrArray.push(v_item.bind)
      }
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind !== 'children') {
        attr += ` :${p_item.bind}="state.${p_item.name}"`
        attrArray.push(p_item.bind)
      }
    }
  })
  event.forEach((e_item) => {
    if (e_item.bindElement === item.id) {
      attr += ` @${transformToVueEvent(e_item.bindEvent)}=${e_item.name}`
      attrArray.push(e_item.bindEvent)
    }
  })
  for (const key in item.attr) {
    if (attrArray.indexOf(key) === -1 && key !== 'children') {
      if (item.attr[key][0] === '{' && item.attr[key][item.attr[key].length - 1] === '}')
        attr += ` ${key}=${item.attr[key]}`
      // #0 由circle父元素修改变量名称
      else
        attr += ` :${key}='${JSON.stringify(item.attr[key])}'`
      attrArray.push(key)
    }
  }
  return attr
}

const parseVueElement = (element, variable, props, event, component) => {
  let res = ''

  element.forEach((item) => {
    let el = ''
    if (item.type === 'nest') {
      el += `
        <div${parseVueElementAttribute(item, variable, props, event)}>
          ${parseVueElementText(item, variable, props) || parseVueElement(item.childrenElement, variable, props, event, component)}
        </div>
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
          <div${parseVueElementAttribute(item, variable, props, event)}>
            <template v-for="(item,index) in state.${item.circleVariableName}" :key="index">
              ${parseVueElement([item.circleElement], variable, props, event, component)}
            </template>
          </div>
        `
    }
    else if (item.type.startsWith('ant-') || item.type.startsWith('eui-')) {
      const name = item.type.split('-')[1]
      component.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        asName: toCamelCase(item.type)
      })
      el += `
        <${toCamelCase(item.type)}${parseVueElementAttribute(item, variable, props, event)}>${parseVueElementText(item, variable, props) || ''}</${toCamelCase(item.type)}>
      `
    }
    else {
      el += `<${item.type}${parseVueElementAttribute(item, variable, props, event)}> `
      el += ['img', 'input'].includes(item.type) ? '' : `${parseVueElementText(item, variable, props) || ''}</${item.type}>`
    }
    res += el
  })

  return res
}


const parseVueProps = (props) => {
  let res = ''
  props.forEach((item, index) => {
    const defaultVal = item.type === 'object' ? `()=>{return ${JSON.stringify(item.value)}}` : `${JSON.stringify(item.value)}`
    res += `${item.name}:{
      default:${defaultVal},
      type: ${capitalizeFirstLetter(item.type)}
    }`;
    if (index !== item.length - 1) res += ','
  });
  return `const props = defineProps({
  ${res}
  }); `
}

const parseVueVariable = (variable, props) => {

  let vStr = ''
  variable.forEach(item => {
    const value = JSON.stringify(item.value)
    const name = item.name
    vStr += `    ${name}:${value},
`;
  });
  props.forEach(item => {
    const name = item.name
    vStr += `    ${name}: props.${name},
`;
  });
  const res = `
const state = ref({
  ${vStr}
      })
`
  return res
}

const parseVueEvent = (event) => {
  let func = ''
  event.forEach((item) => {
    let fn = ''
    if (item.type === 'request') {
      fn = `
const params = {};

        ${JSON.stringify(item.request.params)}.forEach((item) => { const value = get(item); if (value) params[item] = get(item) })
xhrRequest(${JSON.stringify(item.request.url)}, ${JSON.stringify(item.request.method)}, params)
  `
      if (item.request.set) {
        fn += `  .then((res) => { const { data } = res; for (const key in data) { const item = data[key]; if (get(key)) set(key, item) } })
  `
      }
      func += `
const ${item.name} = () => {
        ${fn}
}
`
    }
    else if (item.type === 'custom') {
      fn = item.custom.code
      func += `
const ${item.name} = () => {
        ${fn}
}
`
    }
    else if (item.type === 'setValue') {
      if (item.setValue.useE) fn = `set(${JSON.stringify(item.setValue.variable)}, ${item.setValue.newValue})`
      else fn = `set(${JSON.stringify(item.setValue.variable)}, ${JSON.stringify(item.setValue.newValue)})`
      func += `
const ${item.name} = (${item.setValue.useE ? 'e' : ''}) => {
        ${fn}
}
`
    }
  })
  return func
}

const parseVueGet = () => {
  return `
const get = (key) => {
  return state.value[key]
}
`
}


const parseVueSet = () => {
  return `
const set = (key, value) => {
  state.value = {
    ...state,
    [key]: value
  }
}
`
}

const parseRequest = () => {
  return `
const xhrRequest = (url, method, params) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (params) {
      if (method === 'GET') {
        const queryParams = Object.keys(params)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
          .join('&');
        url += '?' + queryParams;
      }
    }

    xhr.open(method, url, true);

    if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(new Error());
        }
      }
    };

    let requestData = null;

    if (params) {
      if (method === 'POST') {
        requestData = JSON.stringify(params);
      }
    }

    xhr.send(requestData);
  });
}
`
}
const transformToVueEvent = (reactEvent) => {
  switch (reactEvent) {
    case 'onChange':
      return 'change'
    case 'onClick':
      return 'click'
  }
}
module.exports = { parseVueCode };