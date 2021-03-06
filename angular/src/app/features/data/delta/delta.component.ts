/**************************************************************************************************
 * ************************************************************************************************
 *
 * DEPRECATION NOTICE
 *
 * The delta row data model was deprecated in v23.1.0 of ag-Grid.
 * If you are using a newer version then refer to the src/app/features/data/immutable demo
 *
 * ************************************************************************************************
 * ************************************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';

import { Customer } from '../../../models';
import {
  State,
  fetchCustomersForDeltaRowData,
  selectAllCustomers,
  updateCustomer,
} from '../../../state';

@Component({
  templateUrl: './delta.component.html',
  styleUrls: ['./delta.component.scss'],
})
export class DeltaComponent implements OnInit {
  /**
   * The column definitions is an array of ColDef objects.
   */
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Catch Phrase', field: 'catchPhrase' },
    { headerName: 'Street', field: 'address.street1' },
    { headerName: 'City', field: 'address.city' },
    { headerName: 'State', field: 'address.state' },
    { headerName: 'Zip', field: 'address.zip' },
  ];

  /** customers. */
  customers = this.store.pipe(select(selectAllCustomers));

  /** The selected customer form. */
  formGroup = this.formBuilder.group({
    name: ['', Validators.required],
    catchPhrase: ['', Validators.required],
    avatar: '',
    address: this.formBuilder.group({
      street1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    }),
  });

  /** The selected customer that is being edited. */
  private selectedCustomer: Customer;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<State>
  ) {}

  ngOnInit() {
    this.store.dispatch(fetchCustomersForDeltaRowData());
  }

  // You must implement this method for the delta row model
  getRowNodeId(customer: Customer): number {
    return customer.id;
  }

  onGridReady({ api }: { api: GridApi }) {
    api.sizeColumnsToFit();
  }

  onSelectionChanged({ api }: { api: GridApi }): void {
    const selection: Customer[] = api.getSelectedRows();
    if (selection.length === 0) {
      return;
    }

    this.selectedCustomer = selection[0];
    this.formGroup.patchValue(this.selectedCustomer);
  }

  onSubmit(): void {
    this.store.dispatch(
      updateCustomer({
        customer: {
          id: this.selectedCustomer.id,
          changes: this.formGroup.value,
        },
      })
    );
  }
}
