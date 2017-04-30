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
import log from 'log';
import * as DesignerDefaults from './../../configs/designer-defaults';
import {util} from './../sizing-utils';
 
class FunctionInvocationStatementDimensionCalculatorVisitor {

    canVisit(node) {
        log.info('can visit FunctionInvocationStatementDimensionCalc');
        return true;
    }

    beginVisit(node) {
        log.info('begin visit FunctionInvocationStatementDimensionCalc');
    }

    visit(node) {
        log.info('visit FunctionInvocationStatementDimensionCalc');
    }

    endVisit(node) {
        var viewState = node.getViewState();

        // TODO: decide the width and the height based on the statement text width
        viewState.bBox.w = DesignerDefaults.statement.width;
        viewState.bBox.h = DesignerDefaults.statement.height;

        var textWidth = util.getTextWidth(node.children[0].getFunctionalExpression()) +
            DesignerDefaults.statement.innerPadding * 2;
        if(textWidth > viewState.bBox.w){
            viewState.bBox.w = textWidth;
        }

        log.info('end visit FunctionInvocationStatementDimensionCalc');
    }
}

export default FunctionInvocationStatementDimensionCalculatorVisitor;