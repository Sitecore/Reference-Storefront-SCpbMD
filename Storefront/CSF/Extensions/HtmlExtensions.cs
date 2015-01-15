//-----------------------------------------------------------------------
// <copyright file="HtmlExtensions.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
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

namespace Sitecore.Commerce.Storefront.Extensions
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Web.Mvc;
    using System.Web.Routing;
    using System.Web;
    using Sitecore;
    using Sitecore.Analytics;

    /// <summary>
    /// Extensions for working with HTML and HtmlHelpers.
    /// </summary>
    public static class HtmlExtensions
    {
        /// <summary>
        /// Returns an HTML label element and the property name of the property that
        /// is represented by the specified expression, adorned with the attributes specified
        /// by the htmlAttributes.
        /// </summary>
        /// <typeparam name="TModel">The type of the Model.</typeparam>
        /// <typeparam name="TValue">The type of the property.</typeparam>
        /// <param name="html">The HtmlHelper which this method extends.</param>
        /// <param name="expression">An expression that provides the property to be displayed.</param>
        /// <param name="htmlAttributes">An object in the form: new { attribName1 = attribValue1, attribName2 = attribValue2 } which creates attributes and values for the attributes, on the label element.</param>
        /// <returns>
        /// An HTML label element and the property name of the property that is represented by the expression, adorned with the attributes specified
        /// by the htmlAttributes.</returns>
        public static MvcHtmlString LabelForAlt<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes )
        {            
            return LabelHelper(
                html,
                ModelMetadata.FromLambdaExpression(expression, html.ViewData),
                ExpressionHelper.GetExpressionText(expression),
                htmlAttributes
            );
        }

        /// <summary>
        /// Get the ID for an HTML element for a specific model property.  
        /// </summary>
        /// <typeparam name="TModel">The type of the model.</typeparam>
        /// <typeparam name="TValue">The type of the value.</typeparam>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="expression">The expression.</param>
        /// <returns>String that contains the ID of the element.</returns>
        public static string HtmlIdNameFor<TModel, TValue>(
            this HtmlHelper<TModel> htmlHelper,
            System.Linq.Expressions.Expression<Func<TModel, TValue>> expression)
        {
            return (GetHtmlIdNameFor(expression));
        }

        /// <summary>
        /// Returns the visitor identification snippet if needed
        /// </summary>
        /// <param name="sitecoreHelper">The sitecore helper.</param>
        /// <returns>
        /// HtmlString with the identification snippet
        /// </returns>
        public static HtmlString AnalyticsVisitorIdentification(this Sitecore.Mvc.Helpers.SitecoreHelper sitecoreHelper)
        {
            if (Context.Diagnostics.Tracing || Context.Diagnostics.Profiling)
            {
                return new HtmlString("<!-- Visitor identification is disabled because debugging is active. -->");
            }

            if (!Tracker.IsActive)
            {
                return MvcHtmlString.Empty;
            }

            return new HtmlString("<link href=\"/layouts/System/VisitorIdentification.aspx\" rel=\"stylesheet\" type=\"text/css\" />");
        }

        /// <summary>
        /// Gets the HTML id name for.
        /// </summary>
        /// <typeparam name="TModel">The type of the model.</typeparam>
        /// <typeparam name="TValue">The type of the value.</typeparam>
        /// <param name="expression">The expression.</param>
        /// <returns>String that contains the ID of the element.</returns>
        private static string GetHtmlIdNameFor<TModel, TValue>(Expression<Func<TModel, TValue>> expression)
        {
            if (expression.Body.NodeType == ExpressionType.Call)
            {
                var methodCallExpression = (MethodCallExpression)expression.Body;
                string name = GetHtmlIdNameFor(methodCallExpression);
                return name.Substring(expression.Parameters[0].Name.Length + 1).Replace('.', '_');
            }

            return expression.Body.ToString().Substring(expression.Parameters[0].Name.Length + 1).Replace('.', '_');
        }

        private static MvcHtmlString LabelHelper(HtmlHelper html, ModelMetadata metadata, string htmlFieldName, object htmlAttributes)
        {
            string resolvedLabelText = metadata.DisplayName ?? metadata.PropertyName ?? htmlFieldName.Split('.').Last();
            if (string.IsNullOrEmpty(resolvedLabelText))
            {
                return MvcHtmlString.Empty;
            }

            TagBuilder tag = new TagBuilder("label");
            tag.Attributes.Add("for", TagBuilder.CreateSanitizedId(html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(htmlFieldName)));
            tag.MergeAttributes(new RouteValueDictionary(htmlAttributes));
            tag.SetInnerText(resolvedLabelText);
            return MvcHtmlString.Create(tag.ToString(TagRenderMode.Normal));
        }

        private static string GetHtmlIdNameFor(MethodCallExpression expression)
        {
            var methodCallExpression = expression.Object as MethodCallExpression;
            if (methodCallExpression != null)
            {
                return GetHtmlIdNameFor(methodCallExpression);
            }

            return expression.Object.ToString();
        }
    }
}