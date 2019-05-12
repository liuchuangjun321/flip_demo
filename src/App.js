import React, { Component } from 'react'
import './App.css'
import Preview from './components/Preview';
import PreviewHooks from './components/Preview_hooks';

const viewMap = [ <Preview />, <PreviewHooks />]

class App extends Component {
  state = {
    showIndex: 0
  }
  componentDidMount () {
    const mt = window.location.search.match(/showIndex=(\d)/)
    if (mt) {
      this.setState({
        showIndex: +mt[1]
      })
    }
  }
  changeCor (showIndex) {
    this.setState({
      showIndex
    })
  }
  render() {
    return (
      <div className="App">
        <div className="route">
          <span onClick={this.changeCor.bind(this, 0)}>点击切换到 图片放大预览/活肤动效</span>
          <span onClick={this.changeCor.bind(this, 1)}>点击切换到 图片放大预览/活肤动效(react hooks)</span>
        </div>
        <hr/>
        {
          viewMap[this.state.showIndex]
        }
      </div>
    )
  }
}

export default App
