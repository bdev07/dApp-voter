## dApp Voter

dApp Voter is a web based voting application made with simplicity and accessibility in mind. Each written is added to the blockchain for decentralized voting.

[Near Examples][1] were used to create the contract.

[Create-near-app][2] was used as the template project.

### Thought Process

Accessibility was the main source of focus for this project. An at home voting applicaiton would be helpful for those who can't leave their homes, and it would need to be as simple as possible for less tech savvy voters. A voting app that tallies the votes on the blockchain allows for increased security for the voters as well.

The contract is very simple, and just keeps track of two counters.

It was important for the sign in process to feel seemless for those who don't use crypto. The NEAR requestSignIn process helps with that problem immensely.

Simplicity and anonymity could be expanded if the account was created without redirecting to the near wallet access page. The account creation and sign in happens in the background when the voter's driver's license is validated. The license number is used as an account id.

### Notes

See CNA_README.md for the instructions provided by create-near-app

### References

https://github.com/near-examples/rust-counter

https://github.com/near/create-near-app

[1]: https://github.com/near-examples/rust-counter
[2]: https://github.com/near/create-near-app
