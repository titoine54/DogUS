#include "mbed.h"
#include "main.h"
#include "sx1272-hal.h"
#include "debug.h"


#define LORA_CONCENTRATEUR
/* Set this flag to '1' to display debug messages on the console */
#define DEBUG_MESSAGE   1

#define RF_FREQUENCY                                914000000 // Hz
#define TX_OUTPUT_POWER                             0        // 14 dBm

#define LORA_BANDWIDTH                              2         // [0: 125 kHz,
																															//  1: 250 kHz,
																															//  2: 500 kHz,
																															//  3: Reserved]
#define LORA_SPREADING_FACTOR                       7         // [SF7..SF12]
#define LORA_CODINGRATE                             1         // [1: 4/5,
																															//  2: 4/6,
																															//  3: 4/7,
																															//  4: 4/8]
#define LORA_PREAMBLE_LENGTH                        5       // Same for Tx and Rx
#define LORA_SYMBOL_TIMEOUT                         5
#define LORA_FIX_LENGTH_PAYLOAD_ON                  false
#define LORA_FHSS_ENABLED                           false  
#define LORA_NB_SYMB_HOP                            4     
#define LORA_IQ_INVERSION_ON                        false
#define LORA_CRC_ENABLED                            true
    


#define RX_TIMEOUT_VALUE                                3000000   // in us
#define BUFFER_SIZE                                     6        // Define the payload size here

/*
 *  Global variables declarations
 */
typedef enum
{
    LOWPOWER = 0,
    IDLE,
    
    RX,
    RX_TIMEOUT,
    RX_ERROR,
    
    TX,
    TX_TIMEOUT,
    
    CAD,
    CAD_DONE
}AppStates_t;

volatile AppStates_t State = LOWPOWER;

/*!
 * Radio events function pointer
 */
static RadioEvents_t RadioEvents;

/*
 *  Global variables declarations
 */
SX1272MB2xAS Radio( NULL );

const uint8_t PingMsg[] = "PING";
const uint8_t PongMsg[] = "PONG";

uint16_t BufferSize = BUFFER_SIZE;
uint8_t Buffer[BUFFER_SIZE];

int16_t RssiValue = 0;
int8_t SnrValue = 0;

/*
 * Tâche principale 
 */
#ifdef LORA_CONCENTRATEUR

void LoRaConProcess(void)
{

	// Initialize Radio driver
	RadioEvents.TxDone = OnTxDone;
	RadioEvents.RxDone = OnRxDone;
	RadioEvents.RxError = OnRxError;
	RadioEvents.TxTimeout = OnTxTimeout;
	RadioEvents.RxTimeout = OnRxTimeout;
	RadioEvents.CadDone = OnCadDone;
	Radio.Init( &RadioEvents );
	
	
	Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
										 LORA_SPREADING_FACTOR, LORA_CODINGRATE,
										 LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
										 LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
										 LORA_IQ_INVERSION_ON, 2000000 );
    
	Radio.SetRxConfig( MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
											 LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
											 LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON, 0,
											 LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
											 LORA_IQ_INVERSION_ON, true );
	
	
	Radio.SetChannel( RF_FREQUENCY );
	
	Radio.Rx( 3000 );
	
	debug_if( DEBUG_MESSAGE, "Starting concentrator loop\r\n" ); 
	
	while(1)
	{
		switch(State)
		{
			case LOWPOWER:
			
				break;
			
			case IDLE:
				break;
    
			case RX:
				Radio.Sleep();
			  Buffer[5] = '\0';
				debug_if( DEBUG_MESSAGE, "> RSSI : %d\n\r",RssiValue);
			  debug_if( DEBUG_MESSAGE, "> snr : %d\n\r",SnrValue);
			  debug_if( DEBUG_MESSAGE, "> message : %s\n\r",Buffer);
			
				Radio.Rx(0);
				State = IDLE;
				break;
			
			case RX_TIMEOUT:
				break;
			
			case RX_ERROR:
				break;
    
			case TX:
				break;
			
			case TX_TIMEOUT:
				break;
    
			case CAD:		
				break;
			
			case CAD_DONE:				
				break;
		}
	}
}


#else

void LoRaDevProcess(void)
{
	// Initialize Radio driver
	RadioEvents.TxDone = OnTxDone;
	RadioEvents.RxDone = OnRxDone;
	RadioEvents.RxError = OnRxError;
	RadioEvents.TxTimeout = OnTxTimeout;
	RadioEvents.RxTimeout = OnRxTimeout;
	RadioEvents.CadDone = OnCadDone;
	Radio.Init( &RadioEvents );
	
	
	Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
										 LORA_SPREADING_FACTOR, LORA_CODINGRATE,
										 LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
										 LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
										 LORA_IQ_INVERSION_ON, 2000000 );
    
	Radio.SetRxConfig( MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
											 LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
											 LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON, 0,
											 LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
											 LORA_IQ_INVERSION_ON, true );
	
	
	Radio.SetChannel( RF_FREQUENCY );
	
	debug_if( DEBUG_MESSAGE, "Starting device loop\r\n" ); 
	
	while(1)
	{
		switch(State)
		{
			case LOWPOWER:
				Radio.Sleep();
				debug_if( DEBUG_MESSAGE, "> Sleeping...\n\r" );
				wait_ms(5000);
				Radio.Standby();				
				State = TX;
			
				break;
			
			case IDLE:
				break;
    
			case TX:
				Radio.Send( Buffer, BufferSize );
				
				State = IDLE;
				break;
			
			case TX_TIMEOUT:			
				break;
		}
	}
}

#endif


int main() 
{
	#ifdef LORA_CONCENTRATEUR
	
		LoRaConProcess();
	
	#else
	
		LoRaDevProcess();
	
	#endif
}


void OnCadDone (bool channelActivityDetected)
{
}
	

void OnTxDone( void )
{
    State = LOWPOWER;
    debug_if( DEBUG_MESSAGE, "> OnTxDone\n\r" );
}

void OnRxDone( uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr)
{
    BufferSize = size;
    memcpy( Buffer, payload, BufferSize );
    RssiValue = rssi;
    SnrValue = snr;
    State = RX;
    debug_if( DEBUG_MESSAGE, "> OnRxDone\n\r" );
}

void OnTxTimeout( void )
{
    State = RX;
    debug_if( DEBUG_MESSAGE, "> OnTxTimeout\n\r" );
}

void OnRxTimeout( void )
{
    State = RX;
    debug_if( DEBUG_MESSAGE, "> OnRxTimeout\n\r" );
}

void OnRxError( void )
{
    State = RX;
    debug_if( DEBUG_MESSAGE, "> OnRxError\n\r" );
}

