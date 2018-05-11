export default class AclGroupPrivilege extends PlatformSpecificModel {
	@scoped(Scope.NONE) @property privelege;
	@scoped(Scope.NONE) @property table_name;
	@scoped(Scope.NONE) @property group;
}