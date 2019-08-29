import Blockly from 'node-blockly/browser';

// Hue for neural net blocks
const neuralNetColor = 320;

// Multi Layer Perceptron block which converts to either sklearn.neural_network.MLPClassifier or sklearn.neural_network.MLPRegressor depending on the problem class given by the user
export const mlp = {
  name: 'mlp',
  category: 'NeuralNets',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train multi layer perceptron");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("problem")
          .appendField(new Blockly.FieldDropdown([["classification","classification"], ["regression","regression"]]), "problem");
      this.appendValueInput("layers")
          .setCheck("list")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("layers");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("solver")
          .appendField(new Blockly.FieldDropdown([["lbfgs","lbfgs"], ["adam","adam"], ["sgd","sgd"]]), "solver");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("activation")
          .appendField(new Blockly.FieldDropdown([["identity", "identity"], ["logistic", "logistic"], ["tanh", "tanh"], ["relu", "relu"]]), "activation");
      this.appendValueInput("alpha")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("alpha");
      this.appendValueInput("maxIter")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("maximum iterations");
      this.appendValueInput("features")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("features");
      this.appendValueInput("labels")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("labels");
      this.setInputsInline(false);
      this.setColour(neuralNetColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var problemValue = block.getFieldValue('problem');
    console.log(problemValue);
    var layerList = Blockly.Python.valueToCode(block, 'layers', Blockly.Python.ORDER_ATOMIC);
    var solverValue = block.getFieldValue('solver');
    console.log(solverValue);
    var activationValue = block.getFieldValue('activation');
    var alphaValue = Blockly.Python.valueToCode(block, 'alpha', Blockly.Python.ORDER_ATOMIC);
    var maxIterValue = Blockly.Python.valueToCode(block, 'maxIter', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    if (problemValue == "classification") {
      return 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPClassifier(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    } else {
      return 'regression\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPRegressor(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    }
  },
};
