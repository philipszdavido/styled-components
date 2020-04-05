import React, { createElement, Component, useContext } from 'react';
const log = console.log
const ThemeContext = React.createContext()

const tags = [
    "button",
    "div"
]

function evalInterpolation(props, strings, vals) {
    let resultStr = ""
    for (var i = 0; i < strings.length; i++) {
        var str = strings[i];
        var val
        if(vals) {
            val = vals[i]
            if(val !== undefined) {
                if(typeof val === "function") {
                    val = val(props)
                }
                str += val
            }
        }
        resultStr += str
    }
    return resultStr
}

function computeStyle(props, strings, vals) {
    strings = evalInterpolation(props, strings, vals)
    const style = {}
    strings.split(";").forEach((str)=> {
        let [prop, val] = str.trim().split(":")
        if(prop !== undefined && val !== undefined) {
            prop = prop.trim()
            val = val.trim()
            style[prop] = val
        }
    });
    return style
}

function genComponentStyle(tag) {
    return function(strings, ...vals) {
        return class extends Component {
            static contextType = ThemeContext

            constructor(props, context) {
                super(props, context)
                this.style = {}
            }

            componentWillMount() {
                if(this.context)
                    this.props = { ...this.props, theme: this.context}
                this.style = computeStyle(this.props, strings, vals)
            }

            componentWillUpdate(props) {
                if(this.context)
                    props = { ...props, theme: this.context}
                this.style = computeStyle(props, strings, vals)
            }

            render() {
                let props = this.props
                if(this.context) {
                    props = { ...this.props, theme: this.context }
                    this.style = computeStyle(props, strings, vals)
                }

                return (
                    createElement(tag, { style: this.style, ...props }, [...props.children])
                )
            }
        }        
    }
}

function ThemeProvider(props) {
    const outerTheme = props.theme
    const innerTheme = useContext(ThemeContext)
    const theme = { ... outerTheme, ... innerTheme}
    return (
        <React.Fragment>
            <ThemeContext.Provider value={theme}>
                {props.children}
            </ThemeContext.Provider>
        </React.Fragment>
    )
}

export {
    ThemeProvider
}

const styled = {}

tags.forEach(tag => {
    styled[tag] = genComponentStyle(tag)
})

export default styled
