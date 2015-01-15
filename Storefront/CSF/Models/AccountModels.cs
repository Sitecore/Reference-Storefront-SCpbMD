//-----------------------------------------------------------------------
// <copyright file="AccountModels.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the AccountModels class.</summary>
//-----------------------------------------------------------------------
// Copyright 2015 Sitecore Corporation A/S
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file 
// except in compliance with the License. You may obtain a copy of the License at
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the 
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
// either express or implied. See the License for the specific language governing permissions 
// and limitations under the License.
// -------------------------------------------------------------------------------------------

namespace Sitecore.Commerce.Storefront.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// Used to represent a simple user profile
    /// </summary>
    [Table("UserProfile")]
    public class UserProfile
    {
        /// <summary>
        /// Gets or sets the id of the user
        /// </summary>
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the user name
        /// </summary>
        public string UserName { get; set; }
    }

    /// <summary>
    /// Used to represent a user trying to login from an external source
    /// </summary>
    public class RegisterExternalLoginModel
    {
        /// <summary>
        /// Gets or sets the user name
        /// </summary>
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets any external login data
        /// </summary>
        public string ExternalLoginData { get; set; }
    }

    /// <summary>
    /// Used to represent a user trying to set a password
    /// </summary>
    public class LocalPasswordModel
    {
        /// <summary>
        /// Gets or sets the old password
        /// </summary>
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        /// <summary>
        /// Gets or sets the new password
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        /// <summary>
        /// Gets or sets the check to make sure the new password is correct
        /// </summary>
        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    /// <summary>
    /// Used to represent a user trying to login
    /// </summary>
    public class LoginModel
    {
        /// <summary>
        /// Gets or sets the user name
        /// </summary>
        [Required]
        [Display(Name = "Email")]
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the user's password
        /// </summary>
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether or not the user wants to be remembered for next login
        /// </summary>
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    /// <summary>
    /// Used to represent a user trying to register
    /// </summary>
    public class RegisterModel
    {
        /// <summary>
        /// Gets or sets the user name
        /// </summary>
        [Required]
        [Display(Name = "Email")]
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the user's password
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets a check to make sure the user password is correct
        /// </summary>
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// Gets or sets the errors.
        /// </summary>
        /// <value>
        /// The errors.
        /// </value>
        public List<string> Errors { get; set; }
    }

    /// <summary>
    /// Used to represent an external login
    /// </summary>
    public class ExternalLogin
    {
        /// <summary>
        /// Gets or sets the external provider login name
        /// </summary>
        public string Provider { get; set; }

        /// <summary>
        /// Gets or sets the external login provider display name
        /// </summary>
        public string ProviderDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the id of the user to the provider
        /// </summary>
        public string ProviderUserId { get; set; }
    }

    /// <summary>
    /// Used to represent a user profile
    /// </summary>
    public class ProfileModel
    {
        private readonly List<string> _errors = new List<string>();

        /// <summary>
        /// Gets or sets the errors.
        /// </summary>
        /// <value>
        /// The errors.
        /// </value>
        public List<string> Errors {
            get { return _errors; }
        }

        /// <summary>
        /// Gets or sets the user id
        /// </summary>
        [Display(Name = "User Id")]
        public string UserId { get; set; }

        /// <summary>
        /// Gets or sets the external id
        /// </summary>
        [Display(Name = "External Id")]
        public string ExternalId { get; set; }

        /// <summary>
        /// Gets or sets the email
        /// </summary>
        [Display(Name = "Email")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the first name
        /// </summary>
        [Display(Name = "First name")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name
        /// </summary>
        [Display(Name = "Last name")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the telephone
        /// </summary>
        [Display(Name = "Telephone")]
        public string TelephoneNumber { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether direct mail is set or not
        /// </summary>
        [Display(Name = "Direct mail")]
        public bool DirectMailOptOut { get; set; }
    }
}
