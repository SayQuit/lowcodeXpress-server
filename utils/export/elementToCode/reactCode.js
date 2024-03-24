const prettier = require('prettier');
const { toCamelCase } = require('../../str');

const parseReactCode = async (element, name, lib, variable, event, props, onload) => {
  const component = []
  const echartsElement = []
  const el = parseReactElement(element, variable, props, event, component, echartsElement)
  const noRequest = event.filter((item) => { return item.type === 'request' }).length === 0

  return prettier.format(`
  ${parseReactImport(component, lib, echartsElement)}

  function ${name}({${parseReactProps(props)}}) {
  ${parseReactVariable(variable, props)}
  

  ${parseReactGet()}

  ${parseReactSet()}

  ${noRequest ? '' : parseRequest()}

  ${parseReactEcharts(echartsElement) || ''}

  ${parseReactEvent(event)}




    useEffect(()=>{
      ${onload ? onload + '()' : ''}
    },[])

    return (
      <>
        ${el}
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
  if (result) return `{item.${result}}`;
  else return `{item}`;
}

const parseReactImport = (component, lib, echartsElement) => {
  let res = `
  import { useState, useEffect, useMemo, useRef } from "react";
  `
  if (component.length) {
    if (lib.includes('ant-design')) {
      res += `import {
        ${component.map(item => { return item.name + ' as ' + item.asName }).join(`,
      `)}
      } from 'antd';`
    }
  }
  if (echartsElement.length) {
    res += `import * as echarts from 'echarts';`
  }
  return res
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
  const attrArray = []
  variable.forEach((v_item) => {
    if (v_item.bindElement === item.id) {
      if (v_item.bind !== 'children') {
        attr += ` ${v_item.bind}={state.${v_item.name}}`
        attrArray.push(v_item.bind)
      }
    }
  })
  props.forEach((p_item) => {
    if (p_item.bindElement === item.id) {
      if (p_item.bind !== 'children') {
        attr += ` ${p_item.bind}={state.${p_item.name}}`
        attrArray.push(p_item.bind)
      }
    }
  })
  event.forEach((e_item) => {
    if (e_item.bindElement === item.id) {
      attr += ` ${e_item.bindEvent}={${e_item.name}}`
      attrArray.push(e_item.bindEvent)
    }
  })
  for (const key in item.attr) {
    if (attrArray.indexOf(key) === -1 && key !== 'children') {
      if (item.attr[key][0] === '{' && item.attr[key][item.attr[key].length - 1] === '}')
        attr += ` ${key}=${item.attr[key]}`
      else
        attr += ` ${key}={${JSON.stringify(item.attr[key])}}`
      attrArray.push(key)
    }
  }
  return attr
}

const parseReactElement = (element, variable, props, event, component, echartsElement) => {
  let res = ''

  element.forEach((item) => {
    let el = ''
    if (item.type === 'nest') {
      el += `<div${parseReactElementAttribute(item, variable, props, event)}>
          ${parseReactElementText(item, variable, props) || parseReactElement(item.childrenElement, variable, props, event, component, echartsElement)}
        </div>
      `
    }
    else if (item.type === 'container') { }
    else if (item.type === 'circle') {
      item.target.forEach((t_item) => {
        let match = null;
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
      })
      if (item.circleElement.attr) item.circleElement.attr['key'] = 'index'
      el += `<div${parseReactElementAttribute(item, variable, props, event)}>
        {state.${item.circleVariableName}.map((item,index)=>{
          return ${parseReactElement([item.circleElement], variable, props, event, component, echartsElement)}
          })}
        </div>
        `
    }
    else if (item.type.startsWith('ant-') || item.type.startsWith('eui-')) {
      const name = item.type.split('-')[1]
      component.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        asName: toCamelCase(item.type)
      })
      el += `<${toCamelCase(item.type)}${parseReactElementAttribute(item, variable, props, event)}>${parseReactElementText(item, variable, props) || ''}</${toCamelCase(item.type)}>
      `
    }
    else if (item.type.startsWith('echarts-')) {
      el += `<div ref={echartsRef${echartsElement.length}} style={${JSON.stringify(item.styleObject)}}></div>
      `
      echartsElement.push(item)
    }
    else {
      el += `<${item.type}${parseReactElementAttribute(item, variable, props, event)}>${parseReactElementText(item, variable, props) || ''}</${item.type}>
    `
    }
    res += el
  })

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

        ${JSON.stringify(item.request.params)}.forEach((item) => { const value=get(item);if(value)params[item] = get(item) })
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
      if (item.setValue.useE) fn = `set(${JSON.stringify(item.setValue.variable)},${item.setValue.newValue})`
      else fn = `set(${JSON.stringify(item.setValue.variable)},${JSON.stringify(item.setValue.newValue)})`
      func += `
        const ${item.name} = (${item.setValue.useE ? 'e' : ''}) => {
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
            resolve(JSON.parse(xhr.responseText));
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


const parseReactEcharts = (echartsElement) => {
  let res = ''
  if (echartsElement.length === 0) return res
  echartsElement.forEach((item, index) => {
    const option = item.attr.option
    option.series[0]._replace_series = "#"
    option.xAxis._replace_x = "#"
    option.yAxis._replace_y = "#"

    option.yAxis.axisLabel = {}
    option.yAxis.axisLabel.textStyle = item.attr.echartsStyle
    option.xAxis.axisLabel = {}
    option.xAxis.axisLabel.textStyle = item.attr.echartsStyle

    const y = item.bindYElement ? `data:state.${item.bindYElement}` : ''
    const series = item.bindSeriesElement ? `data:state.${item.bindSeriesElement}` : ''
    const x = item.bindXElement ? `data:state.${item.bindXElement}` : ''
    res += `
    const echartsRef${index} = useRef(null);
    const echartsOptions${index}=useMemo(()=>{
      return ${JSON.stringify(option)
        .replace('"_replace_y":"#"', y)
        .replace('"_replace_x":"#"', x)
        .replace('"_replace_series":"#"', series)}
    },[state])
    useEffect(()=>{
      let chart = echarts.init(echartsRef${index}.current);
      chart.setOption(echartsOptions${index});
    },[echartsOptions${index}])

    `
  })
  return res
}
module.exports = { parseReactCode };