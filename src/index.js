import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.nix = this.nix.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      editing: false
    };
  }

  add() {
    console.log("clicked add on node " + this.props.index);
    this.props.addNode(this.props.index);
  }

  nix() {
    console.log("clicked nix on node " + this.props.index);
    this.props.nixNode(this.props.index);
  }

  edit() {
    console.log("clicked edit on node " + this.props.index);
    this.setState({editing: true});
  }

  save() {
    console.log("clicked save on node " + this.props.index);
    this.props.updateNodeText(this.refs.newText.value, this.props.index)
    this.setState({editing: false});
  }

  renderForm() {
    //this is where newText is introduced
    return(
      <div className="node">
        <textarea ref="newText" defaultValue = {this.props.node.text}></textarea>
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

  renderNormal() {
    return(
      <div className="node">
        <p>{this.props.node.text}</p>
        <button onClick={this.add}>Add</button>
        <button onClick={this.edit}>Edit</button>
        <button onClick={this.nix}>Nix</button>
      </div>
    );
  }

  render() {
    //return html to display.
    //can only return 1 parent element
    //access props via this.props.
    if (!this.props.node.nixed)
      if (this.state.editing) {
        return this.renderForm();
      } else {
        return this.renderNormal();
      }
    else {
      return null;
    }
  } 
}

class Cluster extends React.Component {
  constructor(props) {
    super(props);
    this.updateNodeText = this.updateNodeText.bind(this);
    this.addNode = this.addNode.bind(this);
    this.nixNode = this.nixNode.bind(this);
    this.eachNode = this.eachNode.bind(this);
    this.state = {
      nodes: [
        {
          depth: 0,
          text: 'The seed of an idea so good it must be recorded here for your sake and for mine.',
          nixed: false,
          parent_index: null,
          sibling_index: 0,
          sub_nodes: Array(0),
        },
      ]
    }
  }

  addNode(i) {
    console.log("adding sub_node to node " + i);
    var arr = this.state.nodes;
    // add the node to the array of nodes
    var newNode = {
      depth: arr[i].depth + 1,
      text: 'I am a new node! with parent_index ' + i + ' and sibling_index ' + arr[i].sub_nodes.length,
      nixed: false,
      parent_index: i,
      sibling_index: arr[i].sub_nodes.length,
      sub_nodes: Array(0),
    }
    // add a new node to the array
    arr.push(newNode);
    // update the parent node with new child (which node the user clicked "add" from)
    arr[i].sub_nodes.push(newNode);
    // update the parents upstream with new node data until you hit the seed
    var sub_cluster = arr[i];
    var sub_cluster_parent_index = sub_cluster.parent_index;
    //until i reach the seed, whose parents index is null.
    while (sub_cluster_parent_index) {
      arr[sub_cluster_parent_index].sub_nodes[sub_cluster.sibling_index] = sub_cluster;
      //set up for the next round:
      sub_cluster = arr[sub_cluster_parent_index];
      sub_cluster_parent_index = sub_cluster.parent_index;
    }
    this.setState({nodes: arr});
  }

  nixNode(i) {
    console.log("nixing node " + i);
    var arr = this.state.nodes;
    arr[i].nixed = true;
    this.setState({nodes: arr});
  }

  updateNodeText(newText, i) {
    console.log("updating text for node " + i);
    var arr = this.state.nodes;
    arr[i].text = newText;
    this.setState({nodes: arr});
  }

  eachNode(node, i) {
    return(
      <Node 
        key={i}
        index={i}
        node={node}
        updateNodeText = {this.updateNodeText}
        addNode = {this.addNode}
        nixNode = {this.nixNode}
      />
    );
  }

  render() {
    return(
      <div className="Cluster">
        {
          this.state.nodes.map(this.eachNode)
        }
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Cluster/>
  , document.getElementById('root')
);