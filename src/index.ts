// TODO: Allow for token refreshing to happen for long running processes

import { EventEmitter } from 'events';
import got from 'got';
import logger from './logger';
import { DRONE_BASE_URL } from './constants';
import { getSessionToken, apiRequest } from './util';

interface DroneMobileConfig {
  username: string;
  password: string;
  pin?: string;
}

// TODO: make this more expanded
interface SessionInfo {
  accessToken: string | null;
}

class DroneMobile extends EventEmitter {
  private config: DroneMobileConfig = {
    username: '',
    password: '',
    pin: '1234',
  };

  public sessionInfo: SessionInfo = {
    accessToken: null,
  };

  constructor(config: DroneMobileConfig) {
    super();
    logger.debug('Calling constructor');

    this.config = config;
    this.onInit();
  }

  private async onInit(): Promise<string> {
    logger.debug('Calling onInit');
    await this.login();
    this.emit('ready');

    return 'done';
  }

  /**
   * Login to the API and get a accessToken to use for subsequent requests
   */
  public async login(): Promise<string> {
    logger.debug('loggin into to API');
    const { username, password } = this.config;

    const accessToken = await getSessionToken({ username, password });
    this.sessionInfo = {
      accessToken,
    };

    logger.debug(this.sessionInfo.accessToken);

    return '';
  }

  /**
   * Gets the current list of vehicles tied to the account
   * @returns Promise
   */
  public async vehicles(): Promise<Array<any>> {
    logger.debug('get vehicles on API');
    const { accessToken } = this.sessionInfo;

    // TODO: type this
    const response: any = await got({
      url: `${DRONE_BASE_URL}/api/v1/vehicle?limit=100`,
      throwHttpErrors: false,
      headers: {
        'authorization': `Bearer ${accessToken}`,
      },
    }).json();

    logger.debug(response.results);

    return response.results;
  }

  /**
   * Sends the start command to the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async start(vehicleId: number): Promise<string> {
    logger.debug('Start Vehicle');
    
    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'remote_start' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Start was successful!';
  }

  /**
   * Sends the stop command to the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async stop(vehicleId: number): Promise<string> {
    logger.debug('Stop Vehicle');
    
    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'remote_stop' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Stop was successful!';
  }

  /**
   * Sends a lock command to the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async lock(vehicleId: number): Promise<string> {
    logger.debug('lock Vehicle');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'arm' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Lock was successful!';
  }

  /**
   * Sends an unlock command to the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async unlock(vehicleId: number): Promise<string> {
    logger.debug('unlock Vehicle');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'disarm' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Unlock was successful!';
  }

  /**
   * Sends an Open Trunk command to the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async trunk(vehicleId: number): Promise<string> {
    logger.debug('Open Vehicle Trunk');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'trunk' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Open Trunk command was successful!';
  }

  /**
   * Sends a command to the vehicle to toggle the action assigned to aux1
   * @param vehicleId Id of the vehicle to target
   */
  public async aux1(vehicleId: number): Promise<string> {
    logger.debug('Aux1 action triggered');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'remote_aux1' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Aux1 was successful!';
  }

  /**
   * Sends a command to the vehicle to toggle the action assigned to aux2
   * @param vehicleId Id of the vehicle to target
   */
  public async aux2(vehicleId: number): Promise<string> {
    logger.debug('Aux2 action triggered');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'remote_aux2' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return 'Aux2 was successful!';
  }

  /**
   * Gets the location of the vehicle
   * @param vehicleId Id of the vehicle to target
   */
  public async location(vehicleId: number): Promise<string> {
    logger.debug('Get Vehicle Location');

    const response = await apiRequest({
      path: '/api/iot/send-command',
      body: { 'deviceKey': vehicleId, 'command': 'location' },
      accessToken: this.sessionInfo.accessToken,
    });

    if (response.statusCode != 200) {
      logger.debug(response.result);
      throw 'Something went wrong :(';
    }

    return response.result;
  }
}

export default DroneMobile;
