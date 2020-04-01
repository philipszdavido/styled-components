import React, { createElement, Component } from 'react';
const log = console.log

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
            constructor(props) {
                super(props)
                this.style = {}
            }
            componentWillMount() {
                this.style = computeStyle(this.props, strings, vals)
                log(this.props, this.style)
            }
            componentWillUpdate(props) {
                this.style = computeStyle(props, strings, vals)
            }
            render() {
                return (
                    createElement(tag, { style: this.style, ...this.props }, [...this.props.children])
                )
            }
        }        
    }
}

/*<button {...this.props} style={this.style}>
    {this.props.children}
</button>*/

const styled = {}

tags.forEach(tag => {
    styled[tag] = genComponentStyle(tag)
})

export default styled


/********* TRASH BIN ****/




/*
const _styled = {
    button: function(strings, ...vals) {
        return class extends Component {
            constructor(props) {
                super(props)
                this.style = {}
            }

            computeStyle(props, strings, vals) {
                let s = ""
                for (var i = 0; i < strings.length; i++) {
                    var _str = strings[i];
                    var val
                    if(vals) {
                        val = vals[i]
                        if(typeof val === "function") {
                            val = val(props)
                        }
                        _str += val
                    }            
                    s += _str
                }
                const str = s
                const style = {}
                str.split(";").forEach((e)=> {
                    const [prop, val] = e.trim().split(":")
                    style[prop] = val
                });
                return style
            }

            componentWillMount() {
                this.style = this.computeStyle(this.props, strings, vals)
            }

            componentWillUpdate(props) {
                this.style = this.computeStyle(props, strings, vals)
            }

            render() {
                return (
                    <button {...this.props} style={this.style}>
                        {this.props.children}
                    </button>
                )
            }
        }
    }
}*/
