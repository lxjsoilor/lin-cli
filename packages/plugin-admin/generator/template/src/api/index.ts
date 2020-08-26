/**
 * 本案例接口遵循restful风格
 * 详情参考 README.md
 */

// ----------- oauth -----------------
/**
 * 登陆获取 token
 */
export const LoginToken = '/oauth/login/token';

export const Logout = 'oauth/logout/token';
/**
 * 授权登录
 */
export const OAuthLoginToken = '/oauth/auth/callback/flytiger';
/**
 * 获取用户信息
 */
export const UserInfo = '/oauth/current/user';

// ------------------ premit -----------------
/**
 * 获取用户菜单
 */
export const UserMenuTree = '/permit/permitMenu/listUserMenuTree';

// -------------- org -------------------------
/**
 * 选择默认租户
 */
export const SelectDefaultTenant = '/org/company/selectDefaultTenant';
