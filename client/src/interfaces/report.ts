export interface Report 
   {
          id: number,
          patientHN: number,
          patientName: string,
          appointmentDate: string,
          regimenName: string,
          bottles: [
            {
              id: number,
              name: string,
              quantity: number
            }
          ],
          formulas: [
            {
              id: number,
              drugName: string,
              quantity: number,
              formulaQuantity: number,
              formulaUnit: string,
              usage: string,
              location: string
            }
          ]
        };
