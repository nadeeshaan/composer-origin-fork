/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Button from './button';
import Menu from './menu';
import Item from './item';
import DefaultNodeFactory from '../model/default-node-factory';

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.connector.getName();

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        <div className='pkg-name'>{suggestion.pkg.getName()}</div>
        {suggestion.connector.getName()}
    </div>
);
/**
 * Interaction lifeline button component
 */
class LifelineButton extends React.Component {

    constructor() {
        super();
        this.state = {
            listConnectors: false,
            value: '',
            suggestions: [],
        };
        this.showConnectors = this.showConnectors.bind(this);
        this.hideConnectors = this.hideConnectors.bind(this);
        /* this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this); */

        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.storeInputReference = this.storeInputReference.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    }


    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
        });
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        const environment = this.context.editor.environment;
        const packages = environment.getFilteredPackages([]);
        const suggestions = [];
        packages.forEach((pkg) => {
            const pkgname = pkg.getName();
            const connectors = pkg.getConnectors();
            connectors.forEach((connector) => {
                const conName = connector.getName();
                // do the match
                if (value === ''
                    || pkgname.toLowerCase().includes(value)
                    || conName.toLowerCase().includes(value)) {
                    suggestions.push({
                        pkg,
                        connector,
                        packageName: pkg.getName(),
                        fullPackageName: pkg.getName(),
                    });
                }
            });
        });

        this.setState({
            suggestions,
        });
    }

    componentDidMount() {
        this.input.focus();
    }

    onChange(event, { newValue, method }) {
        this.setState({
            value: newValue,
        });
    }

    storeInputReference(autosuggest) {
        if (autosuggest !== null) {
            this.input = autosuggest.input;
        }
    }

    showConnectors() {
        this.setState({ listConnectors: true });
    }

    hideConnectors() {
        this.setState({ listConnectors: false });
    }

    onSuggestionSelected(event, item) {
        const node = DefaultNodeFactory.createEndpoint(item.suggestion);
        this.props.model.acceptDrop(node);
    }

    /**
     * render hover area and button
     * @return {object} button rendering object
     */
    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Select Connector',
            value,
            onChange: this.onChange,
        };

        return (
            <Button
                bBox={this.props.bBox}
                buttonX={0}
                buttonY={0}
                showAlways
            >
                <Menu>
                    { !this.state.listConnectors &&
                    <div>
                        {this.props.items}
                        <Item
                            label='Endpoint'
                            icon='fw fw-endpoint'
                            callback={this.showConnectors}
                        />
                    </div>
                    }
                    { this.state.listConnectors &&
                        <div
                            className='connector-select'
                            // onMouseOut={this.hideConnectors}
                        >
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                onSuggestionSelected={this.onSuggestionSelected}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                alwaysRenderSuggestions
                                inputProps={inputProps}
                                ref={this.storeInputReference}
                            />
                        </div>
                    }
                </Menu>
            </Button>
        );
    }
}

LifelineButton.propTypes = {

};

LifelineButton.defaultProps = {

};

LifelineButton.contextTypes = {
    editor: PropTypes.instanceOf(Object).isRequired,
};

export default LifelineButton;
