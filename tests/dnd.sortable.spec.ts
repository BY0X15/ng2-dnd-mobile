import {
    describe,
    expect,
    beforeEach,
    it,
    inject,
    injectAsync,
    beforeEachProviders,
    TestComponentBuilder,
    ComponentFixture,
    fakeAsync,
    tick
} from 'angular2/testing';

import {TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS}
from 'angular2/platform/testing/browser';

import {Observable} from 'rxjs/Observable';

import {DragDropConfig} from '../src/dnd.config';
import {SortableContainer, SortableComponent} from '../src/dnd.sortable';
import {DragDropService, DragDropSortableService} from '../src/dnd.service';

import {Container3, Container4, triggerEvent} from './dnd.component.factory';

export function main() {
    describe('Sortable Drag and Drop', () => {

        let componentFixture: ComponentFixture;
        let dragdropService: DragDropService;
        let config: DragDropConfig;
        let container:Container3;
        let sortableService:DragDropSortableService

        beforeEachProviders(() => {
            return [TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS, DragDropConfig, DragDropService, DragDropSortableService];
        });

        beforeEach(injectAsync([TestComponentBuilder, DragDropConfig, DragDropService, DragDropSortableService],
            (tcb: TestComponentBuilder, c: DragDropConfig, dd: DragDropService, ds: DragDropSortableService) => {
            dragdropService = dd;
            config = c;
            sortableService = ds;
            return tcb.createAsync(Container3).then((cf: ComponentFixture) => {
                componentFixture = cf;
                componentFixture.detectChanges();
                container = <Container3>componentFixture.componentInstance;
            });
        }));

        it('should be defined', () => {
            expect(componentFixture).toBeDefined();
        });

        it('The elements of the list should be draggable', () => {
            let values:Array<string> = ['one', 'two', 'three', 'four', 'five', 'six'];

            container.sortableList = values;
            componentFixture.detectChanges();

            let ulElem:HTMLElement = componentFixture.nativeElement.querySelector('ul');
            expect(ulElem).toBeDefined();
            expect(ulElem.children.length).toBe(values.length);

            for (let i:number = 0; i < ulElem.children.length; i++) {
                let childElem:HTMLElement = <HTMLElement>ulElem.children[i];
                expect(childElem.attributes[<any>'draggable']).toBeTruthy();
            }
        });

        it('It should sort in the same list', () => {
            let values:Array<string> = ['one','two','three','four'];
            
            container.sortableList = values;
            componentFixture.detectChanges();
            
            let ulElem:HTMLElement = componentFixture.nativeElement.querySelector('ul');
            expect(ulElem).toBeDefined();
            expect(ulElem.children.length).toBe(values.length);

            expect(sortableService.sortableData).not.toBeDefined();
            expect(sortableService.index).not.toBeDefined();
            
            triggerEvent(<HTMLElement>ulElem.children[0], 'dragstart', 'MouseEvent');
            componentFixture.detectChanges();
            expect(sortableService.sortableData).toBe(values);
            expect(sortableService.index).toBe(0);
            
            swap(ulElem.children, 0, 1);
            componentFixture.detectChanges();
            expect(values[0]).toBe('two');
            expect(ulElem.children[0].textContent).toBe('two');
            expect(values[1]).toBe('one');
            expect(ulElem.children[1].textContent).toBe('one');
        });
        
        it('It should work with arbitrary objects', () => {
            let elemOne:HTMLDivElement = document.createElement('div');
            let elemTwo = 'elemTwo';
            let elemThree = {'key':'value'};
            let values:Array<any> = [elemOne, elemTwo, elemThree];
            
            container.sortableList = values;
            componentFixture.detectChanges();
            
            let ulElem:HTMLElement = componentFixture.nativeElement.querySelector('ul');
            expect(ulElem).toBeDefined();
            expect(ulElem.children.length).toBe(values.length);
            
            swap(ulElem.children, 0, 1);
            expect(values[0]).toBe(elemTwo);
            expect(values[1]).toBe(elemOne);
            
            swap(ulElem.children, 1, 2);
            expect(values[1]).toBe(elemThree);
            expect(values[2]).toBe(elemOne);
                    
            swap(ulElem.children, 0, 1);
            expect(values[0]).toBe(elemThree);
            expect(values[1]).toBe(elemTwo);    
        });
    });
    
    describe('Multi List Sortable Drag and Drop', () => {

        let componentFixture: ComponentFixture;
        let dragdropService: DragDropService;
        let config: DragDropConfig;
        let container:Container4;
        let sortableService:DragDropSortableService

        beforeEachProviders(() => {
            return [TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS, DragDropConfig, DragDropService, DragDropSortableService];
        });

        beforeEach(injectAsync([TestComponentBuilder, DragDropConfig, DragDropService, DragDropSortableService],
            (tcb: TestComponentBuilder, c: DragDropConfig, dd: DragDropService, ds: DragDropSortableService) => {
            dragdropService = dd;
            config = c;
            sortableService = ds;
            return tcb.createAsync(Container4).then((cf: ComponentFixture) => {
                componentFixture = cf;
                componentFixture.detectChanges();
                container = <Container4>componentFixture.componentInstance;
            });
        }));

        it('should be defined', () => {
            expect(componentFixture).toBeDefined();
        });
        
        it('It should sort in the same list', () => {
            let singleList:Array<string> = ['sOne', 'sTwo', 'sThree'];
            let multiOneList:Array<string> = ['mOne', 'mTwo', 'mThree']; 
            let multiTwoList:Array<string> = ['mFour', 'mFive', 'mSix'];
            
            container.singleList = singleList;
            container.multiOneList = multiOneList;
            container.multiTwoList = multiTwoList;
            componentFixture.detectChanges();
            
            let divElem:HTMLElement = componentFixture.nativeElement.querySelector('div');
            expect(divElem).toBeDefined();
            expect(divElem.children.length).toBe(3);
            
            let singleElem:HTMLElement = <HTMLElement>divElem.querySelector('#single ul');
            swap(singleElem.children, 0, 1);
            componentFixture.detectChanges();
            expect(singleList[0]).toBe('sTwo');
            expect(singleElem.children[0].textContent).toEqual('sTwo');
            expect(singleList[1]).toBe('sOne');
            expect(singleElem.children[1].textContent).toEqual('sOne');
            
            let multiOneElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiOne ul'); 
            swap(multiOneElem.children, 1, 2);
            componentFixture.detectChanges();
            expect(multiOneList[1]).toBe('mThree');
            expect(multiOneElem.children[1].textContent).toEqual('mThree');
            expect(multiOneList[2]).toBe('mTwo');
            expect(multiOneElem.children[2].textContent).toEqual('mTwo');
            
            let multiTwoElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiTwo ul'); 
            swap(multiTwoElem.children, 1, 2);
            componentFixture.detectChanges();
            expect(multiTwoList[1]).toBe('mSix');
            expect(multiTwoElem.children[1].textContent).toEqual('mSix');
            expect(multiTwoList[2]).toBe('mFive');
            expect(multiTwoElem.children[2].textContent).toEqual('mFive');
        });
        
        it('It should be possible to move items from list one to list two', () => {
            let singleList:Array<string> = ['sOne', 'sTwo', 'sThree'];
            let multiOneList:Array<string> = ['mOne', 'mTwo', 'mThree']; 
            let multiTwoList:Array<string> = ['mFour', 'mFive', 'mSix'];
            
            container.singleList = singleList;
            container.multiOneList = multiOneList;
            container.multiTwoList = multiTwoList;
            componentFixture.detectChanges();
            
            let divElem:HTMLElement = componentFixture.nativeElement.querySelector('div');
            expect(divElem).toBeDefined();
            expect(divElem.children.length).toBe(3);
            
            let multiOneElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiOne ul'); 
            let multiTwoElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiTwo ul'); 
            swapMultiple(multiOneElem.children, 0, multiTwoElem.children, 0);
            componentFixture.detectChanges();
            
            expect(multiOneList.length).toBe(2);
            expect(multiTwoList.length).toBe(4);
            
            expect(multiOneList[0]).toBe('mTwo');
            expect(multiTwoList[0]).toBe('mOne');
            expect(multiTwoList[1]).toBe('mFour');
        });
        
        it('It should not be possible to move items between lists not in the same sortable-zone', () => {
            let singleList:Array<string> = ['sOne', 'sTwo', 'sThree'];
            let multiOneList:Array<string> = ['mOne', 'mTwo', 'mThree']; 
            let multiTwoList:Array<string> = ['mFour', 'mFive', 'mSix'];
            
            container.singleList = singleList;
            container.multiOneList = multiOneList;
            container.multiTwoList = multiTwoList;
            componentFixture.detectChanges();
            
            let divElem:HTMLElement = componentFixture.nativeElement.querySelector('div');
            expect(divElem).toBeDefined();
            expect(divElem.children.length).toBe(3);
            
            let singleElem:HTMLElement = <HTMLElement>divElem.querySelector('#single ul');
            let multiOneElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiOne ul'); 
            swapMultiple(singleElem.children, 0, multiOneElem.children, 0);
            componentFixture.detectChanges();
            
            expect(singleList.length).toBe(3);
            expect(multiOneList.length).toBe(3);
            
            expect(singleList[0]).toBe('sOne');
            expect(multiOneList[0]).toBe('mOne');
        });
        
        it('When the list is empty the parent must handle dragenter events', () => {
            let singleList:Array<string> = ['sOne', 'sTwo', 'sThree'];
            let multiOneList:Array<string> = []; 
            let multiTwoList:Array<string> = ['mOne', 'mTwo', 'mThree', 'mFour', 'mFive', 'mSix'];
            
            container.singleList = singleList;
            container.multiOneList = multiOneList;
            container.multiTwoList = multiTwoList;
            componentFixture.detectChanges();
            
            let divElem:HTMLElement = componentFixture.nativeElement.querySelector('div');
            expect(divElem).toBeDefined();
            expect(divElem.children.length).toBe(3);
            
            let multiOneElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiOne'); 
            let multiTwoUlElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiTwo ul'); 
            
            triggerEvent(<HTMLElement>multiTwoUlElem.children[3], 'dragstart', 'MouseEvent');
            triggerEvent(multiOneElem, 'dragenter', 'MouseEvent');
            componentFixture.detectChanges();
            
            expect(multiOneList.length).toBe(1);
            expect(multiTwoList.length).toBe(5);
            
            expect(multiTwoList[3]).toBe('mFive');
            expect(multiOneList[0]).toBe('mFour');
        });
        
        it('When the list is NOT empty the parent must NOT handle dragenter events', () => {
            let singleList:Array<string> = ['sOne', 'sTwo', 'sThree'];
            let multiOneList:Array<string> = ['mOne']; 
            let multiTwoList:Array<string> = ['mTwo', 'mThree', 'mFour', 'mFive', 'mSix'];
            
            container.singleList = singleList;
            container.multiOneList = multiOneList;
            container.multiTwoList = multiTwoList;
            componentFixture.detectChanges();
            
            let divElem:HTMLElement = componentFixture.nativeElement.querySelector('div');
            expect(divElem).toBeDefined();
            expect(divElem.children.length).toBe(3);
            
            let multiOneElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiOne'); 
            let multiTwoUlElem:HTMLElement = <HTMLElement>divElem.querySelector('#multiTwo ul'); 
            
            triggerEvent(<HTMLElement>multiTwoUlElem.children[0], 'dragstart', 'MouseEvent');
            triggerEvent(multiOneElem, 'dragenter', 'MouseEvent');
            componentFixture.detectChanges();
            
            expect(multiOneList.length).toBe(1);
            expect(multiTwoList.length).toBe(5);
            
            expect(multiOneList[0]).toBe('mOne');
            expect(multiTwoList[0]).toBe('mTwo');
        });
    });
}

function swap(nodes:HTMLCollection, firstNodeId:number, secondNodeId:number) {
    swapMultiple(nodes, firstNodeId, nodes, secondNodeId);
}

function swapMultiple(nodesOne:HTMLCollection, firstNodeId:number, nodesTwo:HTMLCollection, secondNodeId:number) {
    triggerEvent(<HTMLElement>nodesOne[firstNodeId], 'dragstart', 'MouseEvent');
    triggerEvent(<HTMLElement>nodesTwo[secondNodeId], 'dragenter', 'MouseEvent');
}

