import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Products from '@/components/Products.vue'
import dummyStore from './mocks/store' //dummyStore store falso para hacer las pruebas
import vuex from 'vuex'

const localVue = createLocalVue() //permite cargar los plugins 
localVue.use(vuex) //se carga plugins vuex
const store = new vuex.Store(dummyStore) // se genera el store basado en vex con el store falso(dummyStore)

describe('Products.vue', () => {
  it('Muestra el titulo "Nuestros Productos"', () => {
    const title = 'Nuestros Productos'
    const wrapper = shallowMount(Products, {})
    expect(wrapper.find('h1').text()).to.include(title)
  }),

  it('Muestra los productos', () => {
    const productName = 'Computadora'
    const wrapper = shallowMount(Products, {
      data (){
      return {
        products: [{
          name: 'Computadora',
          price: 100.0,
          qty: 1,
        }]
      }
    }
    })
    expect(wrapper.text()).to.include(productName)
  }),

  it('Filtra los productos independiente de mayusculas y minisculas', () => {
    const productSearch = 'computadora'
    const wrapper = shallowMount(Products, {})
    const searchBox = wrapper.find('input')
    wrapper.vm.products = [{
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }]
    searchBox.setValue('teclado') //producto a buscar
    expect(wrapper.text()).to.not.include(productSearch)
    searchBox.setValue(productSearch)
    expect(wrapper.text()).to.include('Computadora')
  }),

  it('Añade los productos al carro', () => {
    const wrapper = shallowMount(Products, {})
    const clickMethodStub = sinon.stub()
    const product = {
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }
    wrapper.vm.products = [product]
    wrapper.setMethods({
      addToCart: clickMethodStub
    })
    const addButton = wrapper.find('.card .button')
    addButton.trigger('click')
    expect(clickMethodStub.calledWith(product)).to.equal(true)
  }),

  it('Añade los productos al store', () =>{
    const wrapper = shallowMount(Products, {localVue, store})
    //se crea un producto x
    const product = {
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }
    wrapper.vm.products = [product] //vm = vue model. Se agrega el producto al componente
    const addButton = wrapper.find('.card .button') //accion de buscar el boton
    addButton.trigger('click')//se da click al boton para agregar el producto al carro
    expect(store.state.shoppingCart.list.length).to.equal(1) //se compara si la lista de productos en el carrito es igual a 1
    expect(store.state.shoppingCart.total).to.equal(100.0) // se pasa el total del producto que creamos
  })
})
