import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';


import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos : Producto[] = [];
  listaProductoFiltro : Producto[] = []; // contendra los resultados de los filtros

  listaProductosParaVenta : DetalleVenta[] = [];
  bloquearBotonRegistrar : boolean = false;

  productoSeleccionado! : Producto;
  tipoPagoPorDefecto : string = 'Efectivo';
  totalPagar : number = 0

  formularioProductoVenta : FormGroup;
  columnasTabla :string[] = ['producto','cantidad','precio','total','accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);


   retornarProductosPorFiltro(busqueda : any) : Producto[]{ //metodo del autocomplete
      const valorBuscado = typeof busqueda == "string" ? busqueda.toLowerCase() : busqueda.nombre.toLocaleLoweCase(); 
      //primera vez entrara un string , despues a la sebgunda y asi se convierte en objeto

      return this.listaProductoFiltro.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado))
   } 


  constructor(
    private fb : FormBuilder,
    private _productoServicio :ProductoService,
    private _ventaServicio : VentaService,
    private _utilidadServicio : UtilidadService

  ) { 
    this.formularioProductoVenta = this.fb.group({
      producto : ["",Validators.required],
      cantidad : ["",Validators.required],
    });

    this._productoServicio.lista().subscribe({
      next:(data) => {
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error:(e)=> {}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => { //cuiando el campo cambie que se aplique la logica
      this.listaProductoFiltro = this.retornarProductosPorFiltro(value);
    })

  }

  ngOnInit(): void {
  }

  mostrarProducto(producto  : Producto) : string{
    return producto.nombre;
  } //evento para mostrar el producto selccionado por medio del campo de busqueda



  productoParaVenta(event: any){     //evento para guardar tempralamente el elemento que se ha seleccionado en la lista
    this.productoSeleccionado = event.option.value;
  }


  agregarProductoParaVenta(){
    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    const _precio :number = parseFloat(this.productoSeleccionado.precio);
    const _total :number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto : this.productoSeleccionado.idProducto,
      descripcionProducto : this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto : String(_precio.toFixed(2)), //para poder trabajar con 2 xecimales,
      totalTexto : String(_total.toFixed(2))
    }) //sera de tipo DETALLE VENTA
  } //evento para poder registrar el producto elegido dentro de nuestra tabla para poder realizar la venta 

}
