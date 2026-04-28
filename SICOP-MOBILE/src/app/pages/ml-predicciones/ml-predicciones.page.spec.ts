import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MlPrediccionesPage } from './ml-predicciones.page';
import { MlService } from '../../features/ml/services/ml.service';
import { of, throwError } from 'rxjs';

describe('MlPrediccionesPage', () => {
  let component: MlPrediccionesPage;
  let fixture: ComponentFixture<MlPrediccionesPage>;
  let mlServiceSpy: jasmine.SpyObj<MlService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MlService', [
      'predict',
      'getAnomalies',
      'getModelInfo',
      'getStats',
      'trainModel',
      'reloadModel'
    ]);

    await TestBed.configureTestingModule({
      imports: [MlPrediccionesPage],
      providers: [{ provide: MlService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MlPrediccionesPage);
    component = fixture.componentInstance;
    mlServiceSpy = TestBed.inject(MlService) as jasmine.SpyObj<MlService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load model info on init', () => {
    const mockModelInfo = {
      version: '1.0',
      model_type: 'RandomForest',
      trained_at: '2024-01-01T00:00:00Z',
      training_records: 1000,
      features: ['turbedad_at', 'ph_at'],
      targets: ['sulfato_aluminio'],
      metrics: { r2: 0.95, rmse: 0.05, mae: 0.03 }
    };

    mlServiceSpy.getModelInfo.and.returnValue(of(mockModelInfo));
    mlServiceSpy.getAnomalies.and.returnValue(of({ 
      anomalies: [],
      total_records: 0,
      anomalies_detected: 0
    }));

    component.ngOnInit();

    expect(mlServiceSpy.getModelInfo).toHaveBeenCalled();
    expect(mlServiceSpy.getAnomalies).toHaveBeenCalled();
  });

  it('should make prediction successfully', () => {
    const mockPrediction = {
      sulfato_aluminio: 100,
      polielectrolito: 10,
      cal_hidratada: 50,
      cloro_gas: 5,
      confidence: 0.95,
      estimated_cost: 1500
    };

    mlServiceSpy.predict.and.returnValue(of(mockPrediction));

    component.predict();

    expect(component.loading).toBe(false);
    expect(component.prediction).toEqual(mockPrediction);
    expect(component.predictionError).toBeNull();
  });

  it('should handle prediction error', () => {
    mlServiceSpy.predict.and.returnValue(
      throwError(() => ({ error: { detail: 'Model not trained' } }))
    );

    component.predict();

    expect(component.loading).toBe(false);
    expect(component.prediction).toBeNull();
    expect(component.predictionError).toBe('Model not trained');
  });

  it('should reset form to default values', () => {
    component.formData.turbedad_at = 100;
    component.prediction = {
      sulfato_aluminio: 100,
      polielectrolito: 10,
      cal_hidratada: 50,
      cloro_gas: 5,
      confidence: 0.95,
      estimated_cost: 1500
    };

    component.resetForm();

    expect(component.formData.turbedad_at).toBe(50);
    expect(component.prediction).toBeNull();
  });
});
