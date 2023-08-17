import { Component, OnInit ,AfterViewInit, ViewChild } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


export const MY_DATA_FORMATS = {
  parse :{
    dateInPut : 'DD/MM/YYYY'
  },
  display:{
    dateInput :  'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers :[
    {provide : MAT_DATE_FORMATS, useValue : MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda : FormGroup;
  opcionesBusqueda : any[] = [
    {value : "fecha",descripcion:"Por fechas"},
    {value : "numero",descripcion:"Numero Venta"}

  ]

  columnasTabla : string[] = ['fechaRegistro','numeroDocumento','tipoPago', 'accion'];
  dataInicio : Venta[] = [];
  datosListaVentas = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private fb : FormBuilder,
    private dialog :MatDialog,
    private _ventaServicio :VentaService,
    private _utilidadServicio : UtilidadService

  ) { 
    this.formularioBusqueda = this.fb.group({
      buscarPor : ['fecha'], //este campo sera el disparador para poder realizar la bsuqueda, si cambia a fecha habilita los dos campos de fecha, si cambia a numero habilita solo el campo d enumero
      numero :[""],
      fechaInicio : [""],
      fechaFin : [""]
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {  //cada vez que cambie que haga una nueva consulta necesitamos limpiar los campos
     
   
      this.formularioBusqueda.patchValue({
        numero : "",
        fechaInicio :"",
        fechaFin : ""
      })
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datosListaVentas.paginator = this.paginacionTabla;
}

aplicarFiltroTabla(event : Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.datosListaVentas.filter = filterValue.trim().toLowerCase();
}

buscarVentas(){
  console.log('ffff')
  let _fechaInicio : string ="";
  let _fechaFin : string ="";

  if(this.formularioBusqueda.value.buscarPor == "fecha"){
    _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
    _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');
    
    if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
      this._utilidadServicio.mostrarAlerta("Debe de ingresar ambas fechas","Oops!");
      return;
    }
  }

  //cuando es de numero de venta, ya no aplicaemso la logica de fecha
  this._ventaServicio.historial(
    this.formularioBusqueda.value.buscarPor,
    this.formularioBusqueda.value.numero,
    _fechaInicio,
    _fechaFin
  ).subscribe({
    next : (data) => {
      if(data.status){
        console.log('eee')
        this.datosListaVentas =data.value;
      }
      else{
        this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!");
      }
    },
    error :(e) => {console.log(e)}
  })

}

verDetalleVenta(_venta:Venta){
  this.dialog.open(ModalDetalleVentaComponent,{
    data : _venta,
    disableClose : true,
    width :'700px'
  })
}


}
