use borsh::{BorshDeserialize, BorshSerialize};
use near_bindgen::{env, near_bindgen};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize, Deserialize)]
pub struct TextMessage {
    text: String
}

/// TODO: make two counters, on for each poll

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    records: HashMap<String, String>,
    count: u8
}

#[near_bindgen]
impl Welcome {
    pub fn set_greeting(&mut self, message: String) {
        let account_id = env::signer_account_id();
        self.records.insert(account_id, message);
    }

    pub fn welcome(&self, account_id: String) -> TextMessage {
        match self.records.get(&account_id) {
            None => {
                env::log(b"Using default message.");
                return TextMessage { text: format!("Hello {}", account_id) }
            },
            _ => return TextMessage { text: format!("{} {}", self.records.get(&account_id).unwrap(), account_id) }
        }
    }

    pub fn get_count(&self) -> u8 {
        return self.count;
    }

    pub fn set_count(&mut self, n: u8) {
        if n < 255 {
            self.count = n;
            let log_message = format!("Set number to {}", self.count);
            env::log(log_message.as_bytes());
            after_counter_change();
        } else {
            env::log(b"[set_count_error] Count would be higher than 254");
        }
    }

    ///TODO: take in parameter for which count to increment
    pub fn increment(&mut self) {
        if self.count+1 < 255 {
            self.count += 1;
            let log_message = format!("Increased number to {}", self.count);
            env::log(log_message.as_bytes());
            after_counter_change();
        } else {
            env::log(b"[increment_error] Count would be higher than 254");
        }
    }

    ///TODO: make restrict access to owner?
    /// Reset to zero.
    pub fn reset(&mut self) {
        self.count = 0;
        // Another way to log is to cast a string into bytes, hence "b" below:
        env::log(b"Reset counter to zero");
    }
}

// unlike the struct's functions above, this function cannot use attributes #[derive(…)] or #[near_bindgen]
// any attempts will throw helpful warnings upon 'cargo build'
// while this function cannot be invoked directly on the blockchain, it can be called from an invoked function
fn after_counter_change() {
    // show helpful warning that u8 (8-bit unsigned integer) will overflow above 255 or below 0
    env::log("Make sure you don't overflow, my friend.".as_bytes());
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_bindgen::MockedBlockchain;
    use near_bindgen::{testing_env, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
        }
    }

    #[test]
    fn set_get_message() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!("howdy bob_near".to_string(), contract.welcome("bob_near".to_string()).text);
    }

    #[test]
    fn get_nonexistent_message() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Welcome::default();
        assert_eq!("Hello francis.near \n Count 0".to_string(), contract.welcome("francis.near".to_string()).text);
    }

    #[test]
    fn get_count() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract  = Welcome::default();
        // println!(contract.get_count());
        assert_eq!(0, contract.get_count());
    }

    #[test]
    fn set_count() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_count(254);
        assert_eq!(254, contract.get_count());
    }

    #[test]
    fn increment() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.increment();
        println!("Value after increment: {}", contract.get_count());
        assert_eq!(1, contract.get_count());
    }

    #[test]
    fn increment_and_reset() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.increment();
        println!("Value after increment: {}", contract.get_count());
        contract.reset();
        println!("Value after reset: {}", contract.get_count());
        // confirm that we received 0 when calling get_count
        assert_eq!(0, contract.get_count());
    }
}
