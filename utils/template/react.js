const prettier = require('prettier');

const reactTemplate = async (element, name, lib, variable, event, props, onload) => {
  const a = parseReactElement(element, variable, props, event)
  const noRequest = event.filter((item) => { return item.type === 'request' }).length === 0
  // const noVariable = variable.length === 0
  // const noProps = props.length === 0
  return prettier.format(`
  ${parseReactImport(lib)}

  function ${name}({${parseReactProps(props)}}) {
  ${parseReactVariable(variable, props)}
  

  ${parseReactGet()}

  ${parseReactSet()}

  ${noRequest ? '' : parseRequest()}

  ${parseReactEvent(event)}




    useEffect(()=>{
      ${onload}()
    },[])

    return (
      <>
        ${a}
      </>
    );
  }
  
  export default ${name};
  `, {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true,
  });
}

function toCamelCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}


const parseReactElementText = (item, variable, props) => {
  let text = null
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind === 'children') text = `{state.${v_item.name}}`
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind === 'children') text = `{state.${p_item.name}}`
    }
  })
  if (item.attr && item.attr.children && !text) return item.attr.children
  else return text
}

const parseReactElementAttribute = (item, variable, props, event) => {
  let attr = ''
  if (Object.keys(item.styleObject).length > 0) attr += ` style={${JSON.stringify(item.styleObject)}}`
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind !== 'children') attr += ` ${v_item.bind}={state.${v_item.name}}`
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind !== 'children') attr += ` ${p_item.bind}={state.${p_item.name}}`
    }
  })
  event.forEach((e_item) => {
    if (e_item.bindElement === item.id) {
      attr += ` ${e_item.bindEvent}={${e_item.name}}`
    }
  })
  return attr
}

const parseReactElement = (element, variable, props, event) => {
  let res = ''
  element.forEach((item) => {
    let el = ''
    if (item.type === 'nest') {
      el += `
        <div${parseReactElementAttribute(item, variable, props, event)}>
          ${parseReactElementText(item, variable, props) || parseReactElement(item.childrenElement, variable, props, event)}
        </div>
      `
    }
    else if (item.type === 'container') { }
    else if (item.type === 'circle') {

    }
    else if (item.type.startsWith('ant-') || item.type.startsWith('eui-')) {
      el += `
        <${toCamelCase(item.type)}${parseReactElementAttribute(item, variable, props, event)}></${toCamelCase(item.type)}>
      `
    }
    else {
      el += `
      <${item.type}${parseReactElementAttribute(item, variable, props, event)}>${parseReactElementText(item, variable, props) || ''}</${item.type}>
    `
    }
    res += el
  })

  return res
}
const parseReactImport = (lib) => {
  let res = ''
  return res
}

const parseReactProps = (props) => {
  let res = ''
  props.forEach((item, index) => {
    res += `${item.name}=${JSON.stringify(item.value)}`;
    if (index !== item.length - 1) res += ','
  });
  return res
}

const parseReactVariable = (variable, props) => {

  let vStr = ''
  variable.forEach(item => {
    const value = JSON.stringify(item.value)
    const name = item.name
    vStr += `    ${name}:${value},
    `;
  });
  props.forEach(item => {
    const name = item.name
    vStr += `    ${name},
    `;
  });
  const res = `
      const [state,setState]=useState({
    ${vStr}
      })
  `
  return res
}

const parseReactEvent = (event) => {
  let func = ''
  event.forEach((item) => {
    let fn = ''
    if (item.type === 'request') {
      fn = `
        const params = {};

        ${JSON.stringify(item.request.params)}.forEach((item) => { params[item] = get(item) })
        xhrRequest(${JSON.stringify(item.request.url)}, ${JSON.stringify(item.request.method)}, params)
      `
      if (item.request.set) {
        fn += `  .then(( res )=>{ const { data }=res; for(const key in data){ const item=data[key]; if(get(key)) set(key,item) }})
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

      fn = `set(${JSON.stringify(item.setValue.variable)},${JSON.stringify(item.setValue.newValue)})`
      func += `
      const ${item.name} = () => {
        ${fn}
      }
      `
    }
  })
  return func
}

const parseReactGet = () => {
  return `
      const get=(key)=>{
        return state[key]
      }
    `
}


const parseReactSet = () => {
  return `
      const set=(key,value)=>{
        setState({
          ...state,
          [key]:value
        })
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

module.exports = { reactTemplate };