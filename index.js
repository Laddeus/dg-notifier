module.exports = function DeadlyGambleNotifier(mod) {
  let enabled = false;
  const allHooks = [];
  const deadlyGambleAbnormalityId = 100801;
  mod.game.initialize("party");

  /* COMMAND */
  mod.command.add(["dgnotify", "dgn"], () => {
    if (["elementalist", "priest"].includes(mod.game.me.class)) {
      enabled = !enabled;
      mod.command.message(
        `Deadly Gamble Notifier is ${enabled ? "enabled" : "disabled"}`
      );
    } else {
      mod.command.message(
        "You must play a healer class in order to use this mod"
      );
    }
  });

  /* HOOKS */
  allHooks.push(
    mod.hook("S_PARTY_MEMBER_ABNORMAL_ADD", 3, (event) => {
      if (enabled && event.id === deadlyGambleAbnormalityId) {
        const partyMember = mod.game.party.partyMembers.find(
          (partyMember) => partyMember.playerId === event.playerId
        );

        if (partyMember) {
          mod.command.message(
            `Player ${partyMember.name} has used Deadly Gamble`
          );
        }
      }
    })
  );

  allHooks.push(
    mod.hook("S_LOGIN", "raw", () => {
      mod.log(mod.game.me.class);
      enabled = ["elementalist", "priest"].includes(mod.game.me.class);
    })
  );

  this.destructor = () => {
    for (let hook of allHooks) {
      if (hook) mod.unhook(hook);
    }

    mod.command.remove(["dgnotify", "dgn"]);
  };
};
