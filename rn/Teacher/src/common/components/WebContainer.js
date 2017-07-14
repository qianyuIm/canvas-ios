/**
 * @flow
 */

import React, { Component } from 'react'
import { View, WebView } from 'react-native'
import RCTSFSafariViewController from 'react-native-sfsafariviewcontroller'
import { isWebUri } from 'valid-url'

const TEMPLATE = `
<html>
    <head>
        <meta name="viewport" content="width={{content-width}},
            initial-scale = 1.0, user-scalable = no" />
        <style>
            body {
                font: -apple-system-body;
                margin: 0;
                padding: 0;
                color: black;
                background-color: white;
            }
            img {
                width: auto;
                height: auto;
                max-width: 100%;
            }
            video {
                width: auto;
                height: auto;
                max-width: 100%;
            }
            #whizzy_content {
                padding: 0;
                margin: 0;
            }
        </style>
    </head>
<body>
    <div id='whizzy_content'>
    {{content}}
    </div>
    <script type="text/javascript">
    window.onload = function () {
        let interval = setInterval(function () {
            if (window.originalPostMessage) {
                let height = document.getElementById('whizzy_content').clientHeight;
                postMessage(JSON.stringify({type: 'UPDATE_HEIGHT', data: height }));
                clearInterval(interval)
            }
        }, 100)
    }
    </script>
</body>
</html>
`

type Props = {
  html: string,
  style?: any,
  scrollEnabled: boolean,
  contentInset?: { top?: number, left?: number, bottom?: number, right?: number },
}
export default class WebContainer extends Component<any, Props, any> {

  constructor (props: Props) {
    super(props)
    this.state = {
      webViewHeight: props.height || 1,
    }
  }

  onLayout = ({ nativeEvent }: { nativeEvent: { layout: { width: number }}}) => {
    const { width } = nativeEvent.layout
    if (width > 0) {
      this.setState({ viewportWidth: Math.ceil(width) })
    }
  }

  onShouldStartLoadWithRequest = (event: any): boolean => {
    if (event && event.url && isWebUri(event.url)) {
      try {
        RCTSFSafariViewController.open(event.url)
      } catch (e) {}
      return false
    }

    return true
  }

  render () {
    let { html, style, scrollEnabled } = this.props
    scrollEnabled = scrollEnabled === undefined ? true : scrollEnabled

    html = TEMPLATE.replace('{{content}}', html)
    html = html.replace('{{content-width}}', `${this.state.viewportWidth}`)
    return (
      <View style={style} onLayout={this.onLayout} testID='web-container.view'>
        {
          this.state.viewportWidth == null
            ? null
            : <WebView
                style={{ height: this.state.webViewHeight, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                source={{ html: html }}
                onMessage={this._onMessage}
                scrollEnabled={scrollEnabled}
                contentInset={this.props.contentInset}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            />
        }
      </View>
    )
  }

  _onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data)
    switch (message.type) {
      case 'UPDATE_HEIGHT':
        this.setState({ webViewHeight: message.data })
        break
    }
  }
}
