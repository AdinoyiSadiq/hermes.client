import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

function copyStyles (sourceDoc, targetDoc) {
  Array.from(sourceDoc.querySelectorAll('link[rel="stylesheet"], style'))
    .forEach(link => {
      targetDoc.head.appendChild(link.cloneNode(true));
    })
}

class WindowPortal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { win: null, el: null };
  }

  componentDidMount() {
    let win = window.open('', '', 'width=600,height=400,left=200,top=200');
    win.document.title = 'Hermes Call';
    let el = document.createElement('div');
    win.document.body.appendChild(el);
    copyStyles(document, win.document);
    this.setState({ win, el });

    win.addEventListener('beforeunload', () => {
      this.props.closeWindow({});
    });
  }

  componentWillUnmount() {
    this.state.win.close();
  }
  
  render() {
    const { el } = this.state;
    if (!el) {
      return null;
    }
    return createPortal(this.props.children, el);
  }
}

export default WindowPortal;
