import { BleManager, Device, State } from 'react-native-ble-plx';
import { Platform } from 'react-native';

// ─── Protocolo Chipsea ────────────────────────────────────────────────────────
// Service e characteristic UUIDs padrão de balanças Chipsea/OKOK
const CHIPSEA_SERVICE_UUID = '0000FFF0-0000-1000-8000-00805F9B34FB';
const CHIPSEA_NOTIFY_UUID = '0000FFF1-0000-1000-8000-00805F9B34FB';
const CHIPSEA_WRITE_UUID = '0000FFF2-0000-1000-8000-00805F9B34FB';

export type BLEState =
  | 'IDLE'
  | 'SCANNING'
  | 'CONNECTING'
  | 'DISCOVERING'
  | 'SUBSCRIBING'
  | 'READING'
  | 'DONE'
  | 'ERROR';

export interface BLEMeasurement {
  weight_kg: number;
  impedance?: number;
  unit: 'kg' | 'lb';
  isStable: boolean;
}

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
}

let manager: BleManager | null = null;

function getManager(): BleManager {
  if (!manager) {
    manager = new BleManager();
  }
  return manager;
}

/**
 * Decodifica pacote de dados Chipsea (protocolo OKOK)
 * Formato: [header][weight_high][weight_low][impedance_high][impedance_low][flags][checksum]
 */
export function decodeChipseaPacket(base64Data: string): BLEMeasurement | null {
  try {
    const bytes = Buffer.from(base64Data, 'base64');
    if (bytes.length < 6) return null;

    const header = bytes[0];
    if (header !== 0xA5 && header !== 0x5A) return null;

    const weightRaw = (bytes[1] << 8) | bytes[2];
    const weight_kg = weightRaw / 100;
    const impedanceRaw = (bytes[3] << 8) | bytes[4];
    const isStable = (bytes[5] & 0x01) === 1;
    const unit = (bytes[5] & 0x02) ? 'lb' : 'kg';

    return { weight_kg, impedance: impedanceRaw || undefined, isStable, unit };
  } catch {
    return null;
  }
}

/**
 * Gera dados mock para desenvolvimento (sem hardware)
 */
export function getMockMeasurement(): BLEMeasurement {
  return {
    weight_kg: 113.75,
    impedance: 480,
    unit: 'kg',
    isStable: true,
  };
}

export class BLEScanner {
  private state: BLEState = 'IDLE';
  private onStateChange: (state: BLEState) => void;
  private onDeviceFound: (device: BLEDevice) => void;
  private onMeasurement: (measurement: BLEMeasurement) => void;
  private connectedDevice: Device | null = null;
  private isMockMode: boolean;

  constructor(options: {
    onStateChange: (state: BLEState) => void;
    onDeviceFound: (device: BLEDevice) => void;
    onMeasurement: (measurement: BLEMeasurement) => void;
    mockMode?: boolean;
  }) {
    this.onStateChange = options.onStateChange;
    this.onDeviceFound = options.onDeviceFound;
    this.onMeasurement = options.onMeasurement;
    this.isMockMode = options.mockMode ?? Platform.OS === 'web';
  }

  setState(state: BLEState) {
    this.state = state;
    this.onStateChange(state);
  }

  async startScan(durationMs = 10000): Promise<void> {
    if (this.isMockMode) {
      this.setState('SCANNING');
      setTimeout(() => {
        this.onDeviceFound({
          id: '50:E4:52:A2:3E:4C',
          name: 'Balança Bluetooth1',
          rssi: -60,
        });
        this.setState('IDLE');
      }, 1500);
      return;
    }

    this.setState('SCANNING');
    const mgr = getManager();

    mgr.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        this.setState('ERROR');
        return;
      }
      if (device && (device.name?.includes('OKOK') || device.name?.includes('Bluetooth'))) {
        this.onDeviceFound({
          id: device.id,
          name: device.name ?? 'Balança',
          rssi: device.rssi ?? -80,
        });
      }
    });

    setTimeout(() => {
      mgr.stopDeviceScan();
      if (this.state === 'SCANNING') this.setState('IDLE');
    }, durationMs);
  }

  async connectAndRead(deviceId: string, deviceName: string): Promise<void> {
    if (this.isMockMode) {
      this.setState('CONNECTING');
      await delay(500);
      this.setState('READING');
      await delay(1000);
      const mock = getMockMeasurement();
      this.onMeasurement(mock);
      this.setState('DONE');
      return;
    }

    try {
      const mgr = getManager();
      this.setState('CONNECTING');
      this.connectedDevice = await mgr.connectToDevice(deviceId);

      this.setState('DISCOVERING');
      await this.connectedDevice.discoverAllServicesAndCharacteristics();

      this.setState('SUBSCRIBING');
      this.connectedDevice.monitorCharacteristicForService(
        CHIPSEA_SERVICE_UUID,
        CHIPSEA_NOTIFY_UUID,
        (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const measurement = decodeChipseaPacket(characteristic.value);
          if (measurement?.isStable) {
            this.onMeasurement(measurement);
            this.setState('DONE');
          }
        }
      );

      this.setState('READING');
    } catch {
      this.setState('ERROR');
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      await this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
    }
    this.setState('IDLE');
  }

  stopScan() {
    if (!this.isMockMode) {
      getManager().stopDeviceScan();
    }
    this.setState('IDLE');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
